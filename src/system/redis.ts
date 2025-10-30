import { createClient } from 'redis'
import { redisService } from '../services/redis'
import { config } from './config'

export const redis = createClient({
  url: config.redis.url,
  password: config.redis.password
})

redis.on('error', error => {
  console.error('❌ Redis client error:', error)
})

export const initRedis = async () => {
  try {
    await redisService.connect()
    console.log('✅ Redis service connected successfully')
  } catch (error) {
    const msg = (error as Error).message
    console.warn('⚠️  Redis connection failed:', msg)
    throw new Error(`Redis initialization failed: ${msg}`)
  }
}
