import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

interface ConfigType {
  port: number
  mongodb: {
    uri: string
    options: {
      useNewUrlParser: boolean
      useUnifiedTopology: boolean
      useFindAndModify: boolean
      useCreateIndex: boolean
    }
  }
  postgres: {
    host: string
    port: number
    database: string
    username: string
    password: string
    dialect: 'postgres'
    logging: boolean
    pool: {
      max: number
      min: number
      acquire: number
      idle: number
    }
  }
  worker?: string
  polygon: {
    apiKey: string
    baseUrl: string
  }
  redis: {
    url: string
    password?: string
    ttl: number
  }
  jwt: {
    secret: string
    expiresIn: string
    refreshExpiresIn: string
  }
  frontend: {
    bucket: string
  }
  timezone: string
}

export const config: ConfigType = {
  port: parseInt(process.env.PORT || '3003', 10),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/casino',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true
    }
  },
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    database: process.env.POSTGRES_DB || 'trading_master',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  worker: process.env.WORKER,
  polygon: {
    apiKey: process.env.POLYGON_API_KEY || '',
    baseUrl: 'https://api.polygon.io'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10)
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  frontend: {
    bucket: process.env.FRONTEND_BUCKET || 'frontend/build'
  },
  timezone: 'America/New_York'
}
