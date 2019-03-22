// @flow

import Waterline from 'waterline'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import overrideRequire from 'override-require'

import paths from 'config/paths'
import database from 'config/database'

// Store it to support teardown
let ORM = null

export default function registerOrm (done: Function) {
  const identityMapping = {}

  const models = fs.readdirSync(paths.models)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const modelPath = path.join(paths.models, file)
      const modelModule = require(modelPath)
      const model = modelModule.oldExport || modelModule.default

      identityMapping[modelPath.replace('.js', '')] = model.identity

      return model
    })
    .reduce((acc, curr) => ({
      ...acc,
      [curr.identity]: curr
    }), {})

  let restoreOriginalModuleLoader

  Waterline.start({
    models,
    ...database
  }, (err, orm) => {
    if (err) {
      console.error(err)

      return
    }

    const isOverride = (request) => {
      return identityMapping[request.replace('.js', '')]
    }

    const resolveRequest = (request) => {
      const identity = identityMapping[request.replace('.js', '')]

      return orm.collections[identity]
    }

    restoreOriginalModuleLoader = overrideRequire(isOverride, resolveRequest)

    ORM = orm

    console.log(chalk.green('ORM initialized'))

    done()
  })

  return (done: Function) => {
    if (restoreOriginalModuleLoader) {
      restoreOriginalModuleLoader()
    }

    Waterline.stop(ORM, (err) => {
      if (err) {
        console.error(err)
      }

      console.log(chalk.green('ORM stopped'))

      done()
    })
  }
}
