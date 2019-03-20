module.exports = {
  'env': {
    'node': true,
    'es6': true,
    'jest/globals': true
  },
  'parser': "babel-eslint",
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'plugins': ['babel', 'flowtype', 'jest'],
  'extends': [
    'standard',
    'plugin:flowtype/recommended'
  ],
  'rules': {
    'no-useless-escape': 0,
    'no-throw-literal': 0,
    'brace-style': ['error', 'stroustrup'],
    'prefer-template': 'error'
  },
  'settings': {
    'import/resolver': {
    }
  }
}
