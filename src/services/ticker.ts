import { Op } from 'sequelize'
import Ticker, { TickerAttributes, TickerCreationAttributes } from 'src/models/ticker'

/**
 * Get all tickers with optional filtering
 */
export const getAllTickers = async (filters?: {
  active?: boolean
  market?: string
  type?: string
  limit?: number
  offset?: number
  search?: string
}): Promise<{ tickers: Ticker[]; total: number }> => {
  const where: Record<PropertyKey, unknown> = {}

  if (filters?.active !== undefined) {
    where.active = filters.active
  }

  if (filters?.market) {
    where.market = filters.market
  }

  if (filters?.type) {
    where.type = filters.type
  }

  if (filters?.search) {
    where[Op.or] = [{ symbol: { [Op.iLike]: `%${filters.search}%` } }, { name: { [Op.iLike]: `%${filters.search}%` } }]
  }

  const { count, rows } = await Ticker.findAndCountAll({
    where,
    limit: filters?.limit || 100,
    offset: filters?.offset || 0,
    order: [['symbol', 'ASC']]
  })

  return {
    tickers: rows,
    total: count
  }
}

/**
 * Get a single ticker by symbol
 */
export const getTickerBySymbol = async (symbol: string): Promise<Ticker | null> => {
  return await Ticker.findOne({
    where: { symbol: symbol.toUpperCase() }
  })
}

/**
 * Get a ticker by ID
 */
export const getTickerById = async (id: number): Promise<Ticker | null> => {
  return await Ticker.findByPk(id)
}

/**
 * Create a new ticker
 */
export const createTicker = async (tickerData: TickerCreationAttributes): Promise<Ticker> => {
  // Ensure symbol is uppercase
  tickerData.symbol = tickerData.symbol.toUpperCase()

  return await Ticker.create(tickerData)
}

/**
 * Update an existing ticker
 */
export const updateTicker = async (symbol: string, tickerData: Partial<TickerAttributes>): Promise<Ticker | null> => {
  const ticker = await getTickerBySymbol(symbol)

  if (!ticker) {
    return null
  }

  await ticker.update(tickerData)
  return ticker
}

/**
 * Delete a ticker by symbol
 */
export const deleteTicker = async (symbol: string): Promise<boolean> => {
  const result = await Ticker.destroy({
    where: { symbol: symbol.toUpperCase() }
  })

  return result > 0
}

/**
 * Bulk create or update tickers
 */
export const bulkUpsertTickers = async (
  tickersData: TickerCreationAttributes[]
): Promise<{ created: number; updated: number }> => {
  let created = 0
  let updated = 0

  for (const tickerData of tickersData) {
    tickerData.name = tickerData.name || ''
    const symbol = tickerData.symbol.toUpperCase()
    const existingTicker = await getTickerBySymbol(symbol)

    if (existingTicker) {
      // Don't update symbol field - it's the unique identifier
      const { symbol: _, ...updateData } = tickerData
      await existingTicker.update(updateData)
      updated++
    } else {
      await createTicker({ ...tickerData, symbol })
      created++
    }
  }

  return { created, updated }
}

/**
 * Get tickers by market type
 */
export const getTickersByMarket = async (
  market: string,
  limit = 100,
  offset = 0
): Promise<{ tickers: Ticker[]; total: number }> => {
  const { count, rows } = await Ticker.findAndCountAll({
    where: { market },
    limit,
    offset,
    order: [['symbol', 'ASC']]
  })

  return {
    tickers: rows,
    total: count
  }
}

/**
 * Search tickers by symbol or name
 */
export const searchTickers = async (query: string, limit = 50): Promise<Ticker[]> => {
  return await Ticker.findAll({
    where: {
      [Op.or]: [{ symbol: { [Op.iLike]: `%${query}%` } }, { name: { [Op.iLike]: `%${query}%` } }]
    },
    limit,
    order: [['symbol', 'ASC']]
  })
}

interface MarketCount {
  market: string
  count: string // Sequelize returns COUNT as string
}

/**
 * Get active tickers count by market
 */
export const getActiveTickersCount = async (): Promise<{ market: string; count: number }[]> => {
  const results = (await Ticker.findAll({
    attributes: ['market', [Ticker.sequelize!.fn('COUNT', Ticker.sequelize!.col('id')), 'count']],
    where: { active: true },
    group: ['market'],
    raw: true
  })) as unknown as MarketCount[]

  // Convert count from string to number
  return results.map(result => ({
    market: result.market,
    count: parseInt(result.count, 10)
  }))
}
