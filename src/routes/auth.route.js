// @flow
/* @flow-runtime annotate */

import type { Controller } from './types'

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
      return { jwt: 'asd', userId: 123 }
    }
  }
]

export default routes
