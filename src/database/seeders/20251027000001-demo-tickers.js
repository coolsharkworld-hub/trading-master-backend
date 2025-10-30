'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date()

    await queryInterface.bulkInsert(
      'tickers',
      [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NASDAQ',
          type: 'CS',
          active: true,
          currency_name: 'usd',
          cik: '0000320193',
          created_at: now,
          updated_at: now
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NASDAQ',
          type: 'CS',
          active: true,
          currency_name: 'usd',
          cik: '0000789019',
          created_at: now,
          updated_at: now
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NASDAQ',
          type: 'CS',
          active: true,
          currency_name: 'usd',
          cik: '0001652044',
          created_at: now,
          updated_at: now
        },
        {
          symbol: 'AMZN',
          name: 'Amazon.com Inc.',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NASDAQ',
          type: 'CS',
          active: true,
          currency_name: 'usd',
          cik: '0001018724',
          created_at: now,
          updated_at: now
        },
        {
          symbol: 'TSLA',
          name: 'Tesla, Inc.',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NASDAQ',
          type: 'CS',
          active: true,
          currency_name: 'usd',
          cik: '0001318605',
          created_at: now,
          updated_at: now
        },
        {
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NASDAQ',
          type: 'CS',
          active: true,
          currency_name: 'usd',
          cik: '0001045810',
          created_at: now,
          updated_at: now
        },
        {
          symbol: 'META',
          name: 'Meta Platforms, Inc.',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NASDAQ',
          type: 'CS',
          active: true,
          currency_name: 'usd',
          cik: '0001326801',
          created_at: now,
          updated_at: now
        },
        {
          symbol: 'SPY',
          name: 'SPDR S&P 500 ETF Trust',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NYSE',
          type: 'ETF',
          active: true,
          currency_name: 'usd',
          created_at: now,
          updated_at: now
        },
        {
          symbol: 'QQQ',
          name: 'Invesco QQQ Trust',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NASDAQ',
          type: 'ETF',
          active: true,
          currency_name: 'usd',
          created_at: now,
          updated_at: now
        },
        {
          symbol: 'DIA',
          name: 'SPDR Dow Jones Industrial Average ETF Trust',
          market: 'stocks',
          locale: 'us',
          primary_exchange: 'NYSE',
          type: 'ETF',
          active: true,
          currency_name: 'usd',
          created_at: now,
          updated_at: now
        }
      ],
      {}
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'tickers',
      {
        symbol: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'SPY', 'QQQ', 'DIA']
      },
      {}
    )
  }
}
