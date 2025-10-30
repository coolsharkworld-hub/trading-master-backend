import { Request, RequestHandler, Response, Router } from 'express'
import { api } from './api'

export interface RouteConfig {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
  path: string
  middleware?: RequestHandler[]
  handler: (req: Request, res: Response) => Promise<unknown>
}

/**
 * Creates a router from an array of route configurations
 * @param routes - Array of route configuration objects
 * @returns Express Router instance with all routes registered
 */
export const createRouter = (routes: RouteConfig[]): Router => {
  const router = Router()

  routes.forEach(({ method, path, middleware = [], handler }) => {
    router[method](path, ...middleware, api.call(handler))
  })

  return router
}

/**
 * Helper to create route configuration with consistent typing
 */
export const route = (config: RouteConfig): RouteConfig => config
