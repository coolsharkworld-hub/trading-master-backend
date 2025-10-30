import { Request } from 'express'
import { analyzeMinsIB } from 'src/services/ib'
import { filterMarketHours } from 'src/services/orb'
import { getStockData } from 'src/services/polygon'
import { ApiValidationError } from 'src/utils/errors'

interface IBAnalysisRequestQuery {
  symbol?: string
  from?: string
  to?: string
  orMinutes?: string
}

/**
 * Analyze Initial Balance for a given symbol and date range
 */
export const analyzeInitialBalance = async (req: Request) => {
  const { symbol, from, to, orMinutes = '60' } = req.query as IBAnalysisRequestQuery

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

  const analysis = analyzeMinsIB(marketHoursData, parseInt(orMinutes))

  return analysis
}
