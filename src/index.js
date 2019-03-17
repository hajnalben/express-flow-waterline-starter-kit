// @flow

import express from 'express'
import initControllers from 'init/initControllers'

const app = express()

initControllers(app)

module.exports = app
