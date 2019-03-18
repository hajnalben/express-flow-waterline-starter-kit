// @flow
/* @flow-runtime ignore */

import express from 'express'
import initControllers from 'init/initControllers'
import initOrm from 'init/initORM'

const app = express()

const tearDown = initOrm(() => initControllers(app))

// $FlowIgnore
app.tearDown = tearDown

module.exports = app
