import sailsDiskAdapter from 'sails-disk'

module.exports = {
  adapters: {
    'disk': sailsDiskAdapter
  },

  datastores: {
    default: {
      adapter: 'disk'
    }
  }
}
