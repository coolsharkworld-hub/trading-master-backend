import compression from 'compression'
import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from 'src/config/swagger'
import { config } from './config'

export const app = express()
export const server = http.createServer(app)

export const loadExpressMiddleware = () => {
  const middlewares = [compression(), cors({ origin: '*' }), express.json(), express.urlencoded({ extended: false })]

  middlewares.forEach(middleware => app.use(middleware))
  
  // Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Trading Master API Documentation'
  }))
  
  app.use(express.static(path.resolve('./') + `/${config.frontend.bucket}`))
}
