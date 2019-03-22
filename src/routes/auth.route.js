// @flow
/* @flow-runtime annotate */

import type { Controller } from './types'
import User from 'models/User'

// Extract the types into a shared directory between the front and backend
export type LoginRequestType = {|
  email: string,
  password: string | number,
  asd?: boolean
|}

export type LoginResponseType = {|
  jwt: string,
  userId: number
|}

export type UserResponseType = {|
  id: string,
  firstName: number,
  lastName: number,
|}

const routes: Controller = [
  {
    method: 'GET',
    route: 'seed',
    handler: async function (): Promise<LoginResponseType> {
      console.log(await User.create({
        firstName: 'asd',
        lastName: 'qwe'
      }))
      console.log(await User.find())

      return { jwt: 'asd', userId: 123 }
    }
  },
  {
    method: 'GET',
    route: 'users/:id',
    handler: async function (nopayload, { id }): Promise<UserResponseType> {
      return User.findOne({ id })
    }
  }
]

export default routes
