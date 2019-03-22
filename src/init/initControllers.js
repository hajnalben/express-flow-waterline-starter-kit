// @flow

import type { $Application } from 'express'
import type { Controller } from 'routes/types'

import fs from 'fs'
import path from 'path'
import t from 'flow-runtime'
import _ from 'lodash'

import paths from 'config/paths'
import env from 'config/env'

const urlPrefix = env.API_URL_PREFIX || ''

const typeReducer = ({ properties }) => properties.reduce((acc, p) => ({
  ...acc,
  [p.key]: {
    type: p.value.toString(),
    required: !p.optional
  }
}), {})

function getParameterAndResponseTypes (handler) {
  const methodType = t.typeOf(handler)

  let payloadType = null

  if (methodType.params.length && methodType.params[0].type && methodType.params[0].type.typeName !== 'AnyType') {
    payloadType = typeReducer(methodType.params[0].type)
  }

  // Return type is wrapped into a Promise
  const returnType = typeReducer(methodType.returnType.type.typeInstances[0].type)

  return {
    payloadType,
    returnType
  }
}

function assertPayloadType (handler, payload) {
  const methodType = t.typeOf(handler)

  // Only check payload type if the handler expects it
  if (!methodType.params.length || !methodType.params[0].type) {
    return
  }

  const validation = t.validate(methodType.params[0].type, payload)

  if (validation.hasErrors()) {
    throw t.makeTypeError(validation)
  }
}

export const documentation = {}

export function registerController (file: string, app: $Application) {
  const controller: Controller = require(path.join(paths.routes, file)).default

  controller.forEach(({ method, route, middleware = [], handler }) => {
    const httpMethods = Array.isArray(method) ? method : [method]
    const prefixedRoute = `${urlPrefix}${route}`
    const middlewares = Array.isArray(middleware) ? middleware : [middleware]

    const handlerWrapper = async (req, res, next) => {
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
      handlerWrapper,
      ...middlewares.map(middlewareName => {
        if (_.isFunction(middlewareName)) {
          return middlewareName
        }

        return require(path.join(paths.middlewares, middlewareName))
      })
    ]

    // Retrieve function parameter and return types
    const { payloadType, returnType } = getParameterAndResponseTypes(handler)

    httpMethods.forEach(m => {
      const httpMethod = m.toLowerCase()

      console.log('Registered route: ', m, prefixedRoute)

      documentation[`${m.toUpperCase()} ${prefixedRoute}`] = {
        payloadType,
        returnType
      }

      // $FlowIgnore: method is checked
      app[httpMethod](prefixedRoute, ...handlers)
    })

    console.log(JSON.stringify(documentation, null, 2))
  })
}

export default function registerControllers (app: $Application) {
  const routeDir = paths.routes

  fs.readdirSync(routeDir)
    .filter(file => file.endsWith('.route.js'))
    .forEach(file => {
      registerController(file, app)
    })
}
