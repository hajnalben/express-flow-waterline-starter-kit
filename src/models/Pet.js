// @flow
/* @flow-runtime ignore */

import Waterline from 'waterline'

export type UserAttributesType = {|
  id: number
|}

export default Waterline.Model.extend({
  identity: 'pet',
  datastore: 'default',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',
      autoMigrations: { autoIncrement: true }
    },
    breed: { type: 'string' },
    type: { type: 'string' },
    name: { type: 'string' },

    // Add a reference to User
    owner: {
      model: 'user'
    }
  }

})
