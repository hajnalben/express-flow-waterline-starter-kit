// @flow

import type { $Application } from 'express'
import type { ControllerMethodType } from 'routes/types'

import fs from 'fs'
import path from 'path'

import t from 'flow-runtime'
import _ from 'lodash'
import paths from 'config/paths'

const urlPrefix = '/api/v1/'

const typeReducer = ({ properties }) => properties.reduce((acc, p) => ({
  ...acc,
  [p.key]: {
    type: p.value.toString(),
    required: !p.optional
  }
}), {})

function getParameterAndResponseTypes (handler) {
  const methodType = t.typeOf(handler)

  // Payload must be the first accepted parameter
  const paramType = typeReducer(methodType.params[0].type)

  // Return type is wrapped into a Promise
  const returnType = typeReducer(methodType.returnType.type.typeInstances[0].type)

  return {
    paramType,
    returnType
  }
}

function assertPayloadType (handler, payload) {
  const methodType = t.typeOf(handler)

  const validation = t.validate(methodType.params[0].type, payload)

  if (validation.hasErrors()) {
    throw t.makeTypeError(validation)
  }
}

export default function (app: $Application) {
  const documentation = {}

  const routeDir = paths.routes

  fs.readdirSync(routeDir)
    .filter(file => file.endsWith('.route.js'))
    .forEach(file => {
      const controller = require(path.join(routeDir, file)).default

      controller.forEach(({ method, route, middleware = [], handler }: ControllerMethodType) => {
        const methods = Array.isArray(method) ? method : [method]
        const middlewares = Array.isArray(middleware) ? middleware : [middleware]

        const smartHandler = async (req, res, next) => {
          try {
            const payload = { ...req.body, ...req.query }

            assertPayloadType(handler, payload)

            // First param is the payload
            const callParams = [payload]

            if (Object.keys(req.params).length) {
              callParams.push(req.params)
            }

            callParams.push({
              user: req.user,
              req,
              res,
              next
            })

            const result = await handler(...callParams)

            if (!res.headersSent) {
              res.send(result)
            }
          }
          catch (err) {
            console.error(err)

            if (!res.headersSent) {
              let status = err.status || 500
              let message = err.message || 'unknown-error'

              res.status(status).send({ message })
            }
          }
        }

        const handlers = [
          smartHandler,
          ...middlewares.map(middlewareName => {
            if (_.isFunction(middlewareName)) {
              return middlewareName
            }

            return require(path.join(paths.middlewares, middlewareName))
          })
        ]

        methods.forEach(m => {
          const httpMethod = m.toLowerCase()
          const prefixedRoute = `${urlPrefix}${route}`

          console.log('Registered route: ', m, prefixedRoute)

          // Retrieve function parameter and return types
          const { paramType, returnType } = getParameterAndResponseTypes(handler)

          documentation[`${m.toUpperCase()} ${prefixedRoute}`] = {
            paramType,
            returnType
          }

          // $FlowHandled: method is checked
          app[httpMethod](prefixedRoute, ...handlers)
        })

        console.log(JSON.stringify(documentation, null, 2))
      })
    })
}
