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

const routes: Controller = [
  {
    method: ['GET', 'POST'],
    route: 'login/:email/:password',
    handler: async function (param: LoginRequestType): Promise<LoginResponseType> {
      console.log(await User.find())

      return { jwt: 'asd', userId: 123 }
    }
  }
]

export default routes
