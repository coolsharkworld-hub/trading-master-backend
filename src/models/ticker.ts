import { DataTypes, Model, Optional, Sequelize } from 'sequelize'

// Ticker attributes interface
export interface TickerAttributes {
  id: number
  symbol: string
  name: string
  market: string
  locale: string
  primaryExchange?: string
  type?: string
  active: boolean
  currencyName?: string
  cik?: string
  compositeFigi?: string
  shareClassFigi?: string
  lastUpdatedUtc?: Date
  delistedUtc?: Date
  createdAt?: Date
  updatedAt?: Date
}

// Creation attributes (optional fields for creation)
export type TickerCreationAttributes = Optional<TickerAttributes, 'id' | 'createdAt' | 'updatedAt'>

// Ticker Model class
export class Ticker extends Model<TickerAttributes, TickerCreationAttributes> implements TickerAttributes {
  public id!: number
  public symbol!: string
  public name!: string
  public market!: string
  public locale!: string
  public primaryExchange?: string
  public type?: string
  public active!: boolean
  public currencyName?: string
  public cik?: string
  public compositeFigi?: string
  public shareClassFigi?: string
  public lastUpdatedUtc?: Date
  public delistedUtc?: Date

  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

// Model definition function - will be called after sequelize is initialized
export const initTickerModel = (sequelize: Sequelize) => {
  Ticker.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      symbol: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Stock ticker symbol'
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Company name'
      },
      market: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'stocks',
        comment: 'Market type (stocks, crypto, fx, etc.)'
      },
      locale: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'us',
        comment: 'Market locale (us, global, etc.)'
      },
      primaryExchange: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Primary exchange (NASDAQ, NYSE, etc.)'
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Security type (CS, ETF, ADRC, etc.)'
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the ticker is actively traded'
      },
      currencyName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Currency name (usd, etc.)'
      },
      cik: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'CIK number'
      },
      compositeFigi: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Composite FIGI identifier'
      },
      shareClassFigi: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Share class FIGI identifier'
      },
      lastUpdatedUtc: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last update timestamp from data source'
      },
      delistedUtc: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Delisting timestamp if applicable'
      }
    },
    {
      sequelize,
      tableName: 'tickers',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'idxTickerS ymbol',
          fields: ['symbol']
        },
        {
          name: 'idxTickerActive',
          fields: ['active']
        },
        {
          name: 'idxTickerMarket',
          fields: ['market']
        },
        {
          name: 'idxTickerType',
          fields: ['type']
        }
      ]
    }
  )

  return Ticker
}

export default Ticker
