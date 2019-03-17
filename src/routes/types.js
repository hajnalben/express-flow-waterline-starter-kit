// @flow

export type HttpMethodTypes = 'GET' | 'get' | 'POST' | 'post' | 'PUT' | 'put' | 'DELETE' | 'delete' | 'PATCH' | 'patch'
export type HttpMethodsType = Array<HttpMethodTypes> | HttpMethodTypes
export type RouteType = string
export type MiddlewareType = Function
export type MiddlewaresType = Array<MiddlewareType> | MiddlewareType
export type Handler = Function

export type ControllerMethodType = {|
  method: HttpMethodsType,
  route: RouteType,
  middleware?: MiddlewaresType,
  handler: Handler
|}

export type Controller = Array<ControllerMethodType>
