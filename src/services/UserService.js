// @flow

import User, { type UserAttributesType } from 'models/User'

class UserService {
  async createUser (user: UserAttributesType) {
    await User.insert(user)
  }
}

export default new UserService()
