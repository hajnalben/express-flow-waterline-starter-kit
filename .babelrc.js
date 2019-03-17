const paths = require('./config/paths')

module.exports = {
  "presets": ["@babel/preset-flow", "@babel/preset-env"],
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "regenerator": true
    }],
    ["flow-runtime", {
      "assert": true,
      "annotate": true
    }],
    ["module-resolver", {
      "root": [paths.src],
      "alias": {
        ...paths.resolveModules
      }
    }]
  ],
  "env": {
    "debug": {
      "sourceMaps": true,
      "retainLines": true
    },
    "production": {
      "plugins": [
        ["flow-runtime", {
          "assert": false,
          "annotate": false
        }]
      ]
    }
  }
}
