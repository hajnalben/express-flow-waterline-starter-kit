import sailsDiskAdapter from 'sails-disk'

// How to use:
// https://sailsjs.com/documentation/concepts/extending-sails/adapters/available-adapters

module.exports = {
  adapters: {
    'sails-disk': sailsDiskAdapter
  },

  datastores: {
    default: {
      adapter: 'sails-disk'
    }
  }
}
