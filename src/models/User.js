// @flow

export type UserAttributesType = {|
  id: number
|}

export default {
  identity: 'user',
  datastore: 'default',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',
      autoMigrations: { autoIncrement: true }
    },
    firstName: { type: 'string' },
    lastName: { type: 'string' },

    // Add a reference to Pets
    pets: {
      collection: 'pet',
      via: 'owner'
    }
  }
}
