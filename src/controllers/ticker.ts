import { Request } from 'express'
import * as tickerService from 'src/services/ticker'
import { ApiValidationError, NotFoundError } from 'src/utils/errors'

/**
 * Get all tickers with optional filters
 */
export const listTickers = async (req: Request) => {
  const { active, market, type, limit, offset, search } = req.query

  const filters = {
    active: active === 'true' ? true : active === 'false' ? false : undefined,
    market: market as string | undefined,
    type: type as string | undefined,
    limit: limit ? parseInt(limit as string, 10) : 100,
    offset: offset ? parseInt(offset as string, 10) : 0,
    search: search as string | undefined
  }

  const result = await tickerService.getAllTickers(filters)

  return {
    success: true,
    data: result.tickers,
    total: result.total,
    limit: filters.limit,
    offset: filters.offset
  }
}

/**
 * Search tickers by symbol or name
 */
export const searchTickers = async (req: Request) => {
  const { q, limit } = req.query

  if (!q) {
    throw new ApiValidationError('Query parameter "q" is required')
  }

  const tickers = await tickerService.searchTickers(q as string, limit ? parseInt(limit as string, 10) : 50)

  return {
    success: true,
    data: tickers,
    count: tickers.length
  }
}

/**
 * Get statistics about tickers
 */
export const getTickerStats = async () => {
  const stats = await tickerService.getActiveTickersCount()

  return {
    success: true,
    data: stats
  }
}

/**
 * Get tickers by market type
 */
export const getTickersByMarketType = async (req: Request) => {
  const { market } = req.params
  const { limit, offset } = req.query

  const result = await tickerService.getTickersByMarket(
    market,
    limit ? parseInt(limit as string, 10) : 100,
    offset ? parseInt(offset as string, 10) : 0
  )

  return {
    success: true,
    data: result.tickers,
    total: result.total,
    market
  }
}

/**
 * Get a single ticker by symbol
 */
export const getTicker = async (req: Request) => {
  const { symbol } = req.params
  const ticker = await tickerService.getTickerBySymbol(symbol)

  if (!ticker) {
    throw new NotFoundError('Ticker not found')
  }

  return {
    success: true,
    data: ticker
  }
}

/**
 * Create a new ticker
 */
export const createTicker = async (req: Request) => {
  const tickerData = req.body

  if (!tickerData.symbol || !tickerData.name || !tickerData.market) {
    throw new ApiValidationError('Missing required fields: symbol, name, market')
  }

  const ticker = await tickerService.createTicker(tickerData)

  return {
    success: true,
    data: ticker,
    message: 'Ticker created successfully'
  }
}

/**
 * Bulk create or update tickers
 */
export const bulkUpsertTickers = async (req: Request) => {
  const { tickers } = req.body

  if (!Array.isArray(tickers) || tickers.length === 0) {
    throw new ApiValidationError('Invalid request: tickers array is required')
  }

  const result = await tickerService.bulkUpsertTickers(tickers)

  return {
    success: true,
    data: result,
    message: `Bulk operation completed: ${result.created} created, ${result.updated} updated`
  }
}

/**
 * Update an existing ticker
 */
export const updateTicker = async (req: Request) => {
  const { symbol } = req.params
  const tickerData = req.body

  const ticker = await tickerService.updateTicker(symbol, tickerData)

  if (!ticker) {
    throw new NotFoundError('Ticker not found')
  }

  return {
    success: true,
    data: ticker,
    message: 'Ticker updated successfully'
  }
}

/**
 * Delete a ticker
 */
export const deleteTicker = async (req: Request) => {
  const { symbol } = req.params
  const deleted = await tickerService.deleteTicker(symbol)

  if (!deleted) {
    throw new NotFoundError('Ticker not found')
  }

  return {
    success: true,
    message: 'Ticker deleted successfully'
  }
}
