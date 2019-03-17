// @flow

const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const paths = {
  appDirectory,
  dotenv: resolveApp('.env'),
  config: resolveApp('config'),
  src: resolveApp('src'),
  routes: resolveApp('src/routes'),
  middlewares: resolveApp('src/middlewares'),
  models: resolveApp('src/models'),
  services: resolveApp('src/services'),
  utils: resolveApp('src/utils')
}

module.exports = {
  ...paths,
  resolveModules: {
    config: paths.config,
    src: paths.src,
    routes: paths.routes,
    middlewares: paths.middlewares,
    models: paths.models,
    services: paths.services
  }
}
