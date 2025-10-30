import { Sequelize } from 'sequelize'
import { initTickerModel } from 'src/models/ticker'
import { initUserModel } from 'src/models/user'
import { config } from './config'

export let sequelize: Sequelize

export const initPostgreSQL = async () => {
  try {
    sequelize = new Sequelize({
      host: config.postgres.host,
      port: config.postgres.port,
      database: config.postgres.database,
      username: config.postgres.username,
      password: config.postgres.password,
      dialect: config.postgres.dialect,
      logging: config.postgres.logging ? console.log : false,
      pool: config.postgres.pool,
      define: {
        timestamps: true,
        underscored: true
      }
    })

    await sequelize.authenticate()
    console.log('✅ PostgreSQL connection established successfully')

    // Initialize models
    initTickerModel(sequelize)
    initUserModel(sequelize)
    console.log('✅ Models initialized')

    // Note: Use migrations (npm run db:migrate) instead of auto-sync
    // Auto-sync is disabled to prevent conflicts with Sequelize CLI migrations
  } catch (error) {
    console.error('❌ Unable to connect to PostgreSQL:', error)
    throw error
  }
}

export const closePostgreSQL = async () => {
  try {
    await sequelize.close()
    console.log('✅ PostgreSQL connection closed')
  } catch (error) {
    console.error('❌ Error closing PostgreSQL connection:', error)
    throw error
  }
}
