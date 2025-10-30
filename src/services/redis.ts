import Redis from 'ioredis'

export interface CacheOptions {
  ttl?: number
}

export class RedisService {
  private client: Redis | null = null
  private isConnected: boolean = false

  constructor() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
      const redisPassword = process.env.REDIS_PASSWORD || undefined

      this.client = new Redis(redisUrl, {
        password: redisPassword,
        lazyConnect: true,
        retryStrategy: times => {
          if (times > 3) {
            console.warn('⚠️  Redis connection failed after 3 attempts, disabling Redis')
            return null
          }
          return Math.min(times * 100, 3000)
        }
      })

      this.setupEventListeners()
    } catch (error) {
      console.error('❌ Failed to initialize Redis client:', error)
      this.client = null
    }
  }

  private setupEventListeners(): void {
    if (!this.client) return

    this.client.on('connect', () => {
      console.log('✅ Redis client connected')
      this.isConnected = true
    })

    this.client.on('error', (error: Error) => {
      console.error('❌ Redis client error:', error)
      this.isConnected = false
    })

    this.client.on('close', () => {
      console.log('🔌 Redis client disconnected')
      this.isConnected = false
    })
  }

  async connect(): Promise<void> {
    if (!this.client) {
      console.warn('⚠️  Redis client not available, skipping connection')
      return
    }

    if (!this.isConnected) {
      try {
        await this.client.connect()
      } catch (error) {
        console.error('❌ Redis connection failed:', error)
        throw error
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      return null
    }

    try {
      if (!this.isConnected) {
        await this.connect()
      }

      const data = await this.client.get(key)
      if (!data) return null

      return JSON.parse(data) as T
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  }

  async set(key: string, value: unknown, options: CacheOptions = {}): Promise<void> {
    if (!this.client) {
      return
    }

    try {
      if (!this.isConnected) {
        await this.connect()
      }

      const ttl = options.ttl || parseInt(process.env.REDIS_TTL || '3600', 10)
      const serializedValue = JSON.stringify(value)

      await this.client.setex(key, ttl, serializedValue)
    } catch (error) {
      console.error('Redis set error:', error)
    }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return

    try {
      if (!this.isConnected) {
        await this.connect()
      }

      await this.client.del(key)
    } catch (error) {
      console.error('Redis delete error:', error)
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) return false

    try {
      if (!this.isConnected) {
        await this.connect()
      }

      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      console.error('Redis exists error:', error)
      return false
    }
  }

  async flushAll(): Promise<void> {
    if (!this.client) return

    try {
      if (!this.isConnected) {
        await this.connect()
      }

      await this.client.flushall()
    } catch (error) {
      console.error('Redis flushall error:', error)
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit()
      this.isConnected = false
    }
  }

  getClient(): Redis | null {
    return this.client
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }

  isAvailable(): boolean {
    return this.client !== null
  }
}

export const redisService = new RedisService()
