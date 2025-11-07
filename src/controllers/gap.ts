import { Request } from 'express'
import moment from 'moment-timezone'
import { analyzeGaps, generateTodayReport } from 'src/services/gap'
import { getStockData } from 'src/services/polygon'
import { config } from 'src/system'
import { StockData } from 'src/types/gap'
import { ApiValidationError } from 'src/utils/errors'

// Constants
const MIN_DATA_POINTS = 2
const FALLBACK_DAYS = 1
const FALLBACK_WEEKS = 7
const DATE_FORMAT = 'YYYY-MM-DD'

interface GapAnalysisRequestQuery {
  symbol?: string
  from?: string
  to?: string
  timeframe?: string
  minGapPercentage?: string
}

const validateDates = (from: string, to: string): { fromDate: Date; toDate: Date } => {
  const fromDate = new Date(from)
  const toDate = new Date(to)

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    throw new ApiValidationError('Invalid date format. Use YYYY-MM-DD format.')
  }

  if (fromDate > toDate) {
    throw new ApiValidationError('From date cannot be after to date')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  fromDate.setHours(0, 0, 0, 0)
  toDate.setHours(0, 0, 0, 0)

  if (fromDate > today) {
    throw new ApiValidationError('From date cannot be in the future')
  }

  return { fromDate, toDate }
}

const adjustToDateIfFuture = (toDate: Date): string => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return toDate > today ? today.toISOString().split('T')[0] : toDate.toISOString().split('T')[0]
}

const fetchStockDataWithFallback = async (
  symbol: string,
  from: string,
  to: string,
  timeSpan: 'day' | 'minute' = 'day',
  multiplier: number = 1
): Promise<StockData[]> => {
  let stockData = await getStockData(symbol, from, to, timeSpan, multiplier)

  // Fallback logic for empty data
  if (stockData.length === 0 && timeSpan === 'day') {
    const fallbackFrom = new Date(from)
    fallbackFrom.setMonth(fallbackFrom.getMonth() - 1)
    const fallbackFromStr = fallbackFrom.toISOString().split('T')[0]

    stockData = await getStockData(symbol, fallbackFromStr, to, timeSpan, multiplier)

    if (stockData.length === 0) {
      throw new ApiValidationError('No stock data found for the given symbol')
    }
  }

  return stockData
}

const getRecentTradingDay = async (symbol: string, startDate: string, endDate: string): Promise<StockData> => {
  const data = await getStockData(symbol, startDate, endDate, 'day', 1)

  if (data.length === 0) {
    throw new ApiValidationError('No previous day data found')
  }

  return data[data.length - 1]
}

const getTodayString = (): string => moment.tz(config.timezone).format(DATE_FORMAT)
const getYesterdayString = (): string => moment.tz(config.timezone).subtract(FALLBACK_DAYS, 'days').format(DATE_FORMAT)
const getWeekAgoString = (): string => moment.tz(config.timezone).subtract(FALLBACK_WEEKS, 'days').format(DATE_FORMAT)

/**
 * Analyze gaps for a given symbol and date range
 */
export const analyzeGapData = async (req: Request) => {
  const { symbol, from, to } = req.query as GapAnalysisRequestQuery

  if (!symbol || !from || !to) {
    throw new ApiValidationError('Missing required parameters: symbol, from, to')
  }

  const { toDate } = validateDates(from, to)
  const adjustedTo = adjustToDateIfFuture(toDate)

  const stockData = await fetchStockDataWithFallback(symbol, from, adjustedTo)

  if (stockData.length < MIN_DATA_POINTS) {
    throw new ApiValidationError(`Insufficient data for gap analysis. Need at least ${MIN_DATA_POINTS} days of data.`)
  }

  return analyzeGaps(symbol, stockData)
}

/**
 * Analyze today's gap for a given symbol
 */
export const analyzeTodayGap = async (req: Request) => {
  const { symbol } = req.query as GapAnalysisRequestQuery

  if (!symbol) {
    throw new ApiValidationError('Missing required parameter: symbol')
  }

  const todayStr = getTodayString()
  const yesterdayStr = getYesterdayString()

  // Fetch previous trading day's data with fallback
  let previousDayData = await getStockData(symbol, yesterdayStr, yesterdayStr, 'day')

  if (previousDayData.length === 0) {
    const weekAgoStr = getWeekAgoString()
    previousDayData = [await getRecentTradingDay(symbol, weekAgoStr, yesterdayStr)]
  }

  const previousDay = previousDayData[previousDayData.length - 1]

  // Fetch today's intraday data (1-minute candles)
  const todayIntradayData = await getStockData(symbol, todayStr, todayStr, 'minute', 1)

  if (todayIntradayData.length === 0) {
    throw new ApiValidationError('No intraday data available for today')
  }

  return generateTodayReport(symbol, previousDay, todayIntradayData)
}
