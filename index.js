const http = require('http')
const chalk = require('chalk')
const env = require('./config/env')

let app

if (process.env.NODE_ENV === 'development') {
  // Enable HotModuleReplacment

  const hmr = require('node-hmr')

  hmr(() => {
    if (app) {
      app.tearDown(() => {
        app = require('./src')

        console.log(chalk.green('[HMR] App module replaced'))
      })
    }
    else {
      app = require('./src')
    }
  }, { watchDir: './src' })
}
else {
  app = require('./dist')
}

const server = http.createServer((req, res) => app(req, res))

server.listen(env.PORT, env.HOST, () => {
  console.log(chalk.blue(`Server started: http://${env.HOST}:${env.PORT}`))
})
