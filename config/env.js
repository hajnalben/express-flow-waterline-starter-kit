const fs = require('fs')
const paths = require('./paths')
const dotenvParseVariables = require('dotenv-parse-variables')

delete require.cache[require.resolve('./paths')]

if (!process.env.NODE_ENV) {
  throw new Error(
    'The process.env.NODE_ENV environment variable is required but was not specified.'
  )
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${paths.dotenv}.${process.env.NODE_ENV}.local`,
  `${paths.dotenv}.${process.env.NODE_ENV}`,
  process.env.NODE_ENV !== 'test' && `${paths.dotenv}.local`,
  paths.dotenv
].filter(Boolean)

let env = {}

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    const { parsed } = require('dotenv').config({
      path: dotenvFile
    })

    env = {
      ...env,
      ...dotenvParseVariables(parsed)
    }
  }
})

module.exports = env
