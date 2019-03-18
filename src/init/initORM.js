// @flow

import Waterline from 'waterline'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import overrideRequire from 'override-require'

import paths from 'config/paths'
import database from 'config/database'

// Avaible adapters
// https://sailsjs.com/documentation/concepts/extending-sails/adapters/available-adapters#?community-supported-database-adapters

export default function (done: Function) {
  const waterline = new Waterline()

  const identityMapping = {}

  fs.readdirSync(paths.models)
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
      const modelPath = path.join(paths.models, file)
      const model = require(modelPath).default

      identityMapping[modelPath.replace('.js', '')] = model.prototype.identity

      // require(path.join(paths.models, file)).default = 'waterline.collections[model.prototype.identity]'

      waterline.registerModel(model)
    })

  let restoreOriginalModuleLoader

  waterline.initialize(database, (err, ontology) => {
    if (err) {
      console.error(err)
    }

    const isOverride = (request) => {
      return identityMapping[request.replace('.js', '')]
    }

    const resolveRequest = (request) => {
      const identity = identityMapping[request.replace('.js', '')]

      return ontology.collections[identity]
    }

    restoreOriginalModuleLoader = overrideRequire(isOverride, resolveRequest)

    console.log(chalk.green('ORM initialized'))

    done()
  })

  return (done: Function) => {
    if (restoreOriginalModuleLoader) {
      restoreOriginalModuleLoader()
    }

    waterline.teardown(done)
  }
}
