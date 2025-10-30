import { Request } from 'express'
import { analyzeMinsORB, filterMarketHours } from 'src/services/orb'
import { getStockData } from 'src/services/polygon'
import { ApiValidationError } from 'src/utils/errors'

interface ORBAnalysisRequestQuery {
  symbol?: string
  from?: string
  to?: string
  orMinutes?: string
}

/**
 * Analyze Opening Range Breakout for a given symbol and date range
 */
export const analyzeOpeningRange = async (req: Request) => {
  const { symbol, from, to, orMinutes = '15' } = req.query as ORBAnalysisRequestQuery

  if (!symbol || !from || !to || !orMinutes) {
    throw new ApiValidationError('Missing required parameters: symbol, from, to, orMinutes')
  }

  const minuteData = await getStockData(symbol, from, to, 'minute', 1)

  if (minuteData.length === 0) {
    throw new ApiValidationError('No minute-level data found')
  }

  const marketHoursData = filterMarketHours(minuteData)

  if (marketHoursData.length === 0) {
    throw new ApiValidationError('No market hours data found after filtering')
  }

  const analysis = analyzeMinsORB(marketHoursData, parseInt(orMinutes))

  return analysis
}
