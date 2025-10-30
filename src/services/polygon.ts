import axios, { AxiosResponse } from 'axios'
import { config } from 'src/system'
import { StockData } from 'src/types/gap'
import { PolygonAggregateResponse } from 'src/types/polygon'
import { redisService } from './redis'

const generateCacheKey = (symbol: string, from: string, to: string, timeSpan: 'day' | 'minute'): string => {
  return `polygon:${symbol}:${from}:${to}:${timeSpan}`
}

export const getStockData = async (
  symbol: string,
  from: string,
  to: string,
  timeSpan: 'day' | 'minute' = 'day',
  multiplier: number = 1
): Promise<StockData[]> => {
  const cacheKey = generateCacheKey(symbol, from, to, timeSpan)
  const cachedData = await redisService.get<StockData[]>(cacheKey)

  if (cachedData) {
    return cachedData
  }

  console.log(`⚠️  Cache miss for ${symbol}, fetching from Polygon API`)

  try {
    const response: AxiosResponse<PolygonAggregateResponse> = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timeSpan}/${from}/${to}`,
      {
        params: {
          adjusted: true,
          sort: 'asc',
          limit: 50000,
          apiKey: config.polygon.apiKey
        },
        timeout: 30000,
        headers: {
          'User-Agent': 'TradingMasterApp/1.0'
        }
      }
    )

    if (!response.data.results || response.data.results.length === 0) {
      return []
    }

    const stockData: StockData[] = response.data.results.map(result => {
      return {
        t: result.t,
        o: result.o,
        h: result.h,
        l: result.l,
        c: result.c,
        v: result.v,
        vw: result.vw
      }
    })
    const ttl = timeSpan === 'minute' ? 300 : 3600
    await redisService.set(cacheKey, stockData, { ttl })
    console.log(`💾 Cached ${stockData.length} records for ${symbol}`)

    return stockData
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Polygon API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })

      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error(
          `Polygon API timeout: Request took too long. Try a smaller date range or use daily data instead of minute data.`
        )
      }

      if (error.response?.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 5000))
        return getStockData(symbol, from, to, timeSpan, multiplier)
      }

      if (error.response?.status === 404) {
        return []
      }

      if (error.response?.status === 403) {
        throw new Error(`Polygon API authentication failed. Check your API key.`)
      }

      throw new Error(`Polygon API error: ${error.message}`)
    }

    throw new Error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
