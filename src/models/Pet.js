// @flow

export type PetAttributesType = {|
  id: number
|}

export default {
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

}
