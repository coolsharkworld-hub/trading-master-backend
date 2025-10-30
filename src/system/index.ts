import { config } from './config'

export * from './config'
export * from './express'
export * from './mongo'
export * from './postgres'
export * from './redis'

import { loadExpressMiddleware, server } from './express'
import { initPostgreSQL } from './postgres'
import { initRedis } from './redis'

export const init = async () => {
  // await initMongoDB();

  // Initialize PostgreSQL
  await initPostgreSQL()

  // Redis cache disabled - using direct API calls for real-time data
  await initRedis()

  // Attach all express middlewares
  loadExpressMiddleware()
  console.log('✅ Express middlewares loaded')
}

export const run = () => {
  server
    .listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`)
    })
    .on('error', (error: Error) => {
      throw new Error(error.message)
    })
}
