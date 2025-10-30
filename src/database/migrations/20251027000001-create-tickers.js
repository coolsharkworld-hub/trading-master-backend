'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tickers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Stock ticker symbol'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Company name'
      },
      market: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: 'stocks',
        comment: 'Market type (stocks, crypto, fx, etc.)'
      },
      locale: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: 'us',
        comment: 'Market locale (us, global, etc.)'
      },
      primary_exchange: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Primary exchange (NASDAQ, NYSE, etc.)'
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Security type (CS, ETF, ADRC, etc.)'
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether the ticker is actively traded'
      },
      currency_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Currency name (usd, etc.)'
      },
      cik: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'CIK number'
      },
      composite_figi: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Composite FIGI identifier'
      },
      share_class_figi: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Share class FIGI identifier'
      },
      last_updated_utc: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Last update timestamp from data source'
      },
      delisted_utc: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Delisting timestamp if applicable'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })

    // Create indexes
    await queryInterface.addIndex('tickers', ['symbol'], {
      name: 'idx_ticker_symbol',
      unique: false
    })

    await queryInterface.addIndex('tickers', ['active'], {
      name: 'idx_ticker_active',
      unique: false
    })

    await queryInterface.addIndex('tickers', ['market'], {
      name: 'idx_ticker_market',
      unique: false
    })

    await queryInterface.addIndex('tickers', ['type'], {
      name: 'idx_ticker_type',
      unique: false
    })

    // Add table comment
    await queryInterface.sequelize.query("COMMENT ON TABLE tickers IS 'Store ticker/symbol information for trading'")
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tickers')
  }
}
