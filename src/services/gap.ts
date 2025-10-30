import moment from 'moment-timezone'
import { config } from 'src/system'
import { Gap, GapAnalysisReport, GapResult, StockData, TodayGapReport } from '../types/gap'

export const detectGaps = (data: StockData[]): Gap[] => {
  return data.slice(1).map((currBar, idx) => {
    const i = idx + 1
    const prevClose = data[i - 1].c
    const currOpen = currBar.o
    const gapSize = currOpen - prevClose
    const isGapUp = gapSize > 0

    return {
      type: isGapUp ? 'gap_up' : 'gap_down',
      date: moment(currBar.t).tz(config.timezone).format('YYYY-MM-DD'),
      gapIndex: i,
      previousClose: prevClose,
      currentOpen: currOpen,
      gapSize: Math.abs(gapSize),
      gapSizePercent: Math.abs((gapSize / prevClose) * 100),
      gapHigh: isGapUp ? currOpen : prevClose,
      gapLow: isGapUp ? prevClose : currOpen,
      filled: false,
      filledDate: null,
      filledIndex: null,
      daysToFill: null,
      partiallyFilled: false,
      highestPriceAfterGap: currBar.h,
      lowestPriceAfterGap: currBar.l
    }
  })
}

export const checkGapFills = (gaps: Gap[], data: StockData[]): GapResult[] => {
  for (const gap of gaps) {
    const isGapUp = gap.type === 'gap_up'

    for (let i = gap.gapIndex; i < data.length; i++) {
      const { h, l, t } = data[i]

      gap.highestPriceAfterGap = Math.max(gap.highestPriceAfterGap, h)
      gap.lowestPriceAfterGap = Math.min(gap.lowestPriceAfterGap, l)

      const isFilled = isGapUp ? l <= gap.gapLow : h >= gap.gapHigh

      if (isFilled) {
        gap.filled = true
        gap.filledDate = moment(t).tz(config.timezone).format('YYYY-MM-DD')
        gap.filledIndex = i
        gap.daysToFill = i - gap.gapIndex
        break
      }

      if (isGapUp ? l < gap.gapHigh && l > gap.gapLow : h > gap.gapLow && h < gap.gapHigh) {
        gap.partiallyFilled = true
      }
    }
  }

  return gaps.map(({ type, date, gapSize, filled, partiallyFilled }) => ({
    type,
    date,
    gapSize: parseFloat(gapSize.toPrecision(6)),
    filled: partiallyFilled ? false : filled
  }))
}

export const analyzeGaps = (symbol: string, stocks: StockData[]): GapAnalysisReport => {
  const gaps = detectGaps(stocks)
  const gapsData = checkGapFills(gaps, stocks)

  const summary = gapsData.reduce(
    (acc, gap) => {
      const isGapUp = gap.type === 'gap_up'
      if (isGapUp) {
        acc.gapUpCount++
        if (gap.filled) {
          acc.gapUpFilled++
        } else {
          acc.gapUpNotFilled++
        }
      } else {
        acc.gapDownCount++
        if (gap.filled) {
          acc.gapDownFilled++
        } else {
          acc.gapDownNotFilled++
        }
      }
      return acc
    },
    {
      totalGaps: gapsData.length,
      gapUpCount: 0,
      gapDownCount: 0,
      gapUpFilled: 0,
      gapUpNotFilled: 0,
      gapDownFilled: 0,
      gapDownNotFilled: 0
    }
  )

  return { symbol, summary, gaps: gapsData }
}

export const generateTodayReport = (
  symbol: string,
  previousDayData: StockData,
  todayIntradayData: StockData[]
): TodayGapReport => {
  const sortedIntraday = [...todayIntradayData].sort((a, b) => a.t - b.t)

  const previousClose = previousDayData.c
  const target = previousClose

  const todayOpen = sortedIntraday.length > 0 ? sortedIntraday[0].o : 0
  const currentPrice = sortedIntraday.length > 0 ? sortedIntraday[sortedIntraday.length - 1].c : todayOpen

  const rawGapSize = todayOpen - previousClose
  const gapSize = Math.abs(rawGapSize)
  const gapSizePercentage = (rawGapSize / previousClose) * 100

  let gapType: 'gap up' | 'gap down' | 'no gap'
  if (Math.abs(gapSizePercentage) < 0.01) {
    gapType = 'no gap'
  } else {
    gapType = rawGapSize > 0 ? 'gap up' : 'gap down'
  }

  let gapFillPercentage = 0
  let maxDistanceCovered = 0
  let gapSpike = 0
  let fillTime: string | null = null
  let gapStatus: 'filled' | 'not filled' = 'not filled'

  if (gapType !== 'no gap') {
    for (const candle of sortedIntraday) {
      if (gapType === 'gap up') {
        // Track maximum distance covered toward gap fill (downward from todayOpen)
        const distanceCovered = todayOpen - candle.l
        if (distanceCovered > maxDistanceCovered) {
          maxDistanceCovered = distanceCovered
        }

        if (gapStatus === 'not filled') {
          const spikeDistance = candle.h - todayOpen
          if (spikeDistance > gapSpike) {
            gapSpike = spikeDistance
          }
        }

        if (candle.l <= previousClose && gapStatus === 'not filled') {
          gapStatus = 'filled'
          fillTime = new Date(candle.t).toISOString()
        }
      } else if (gapType === 'gap down') {
        // Track maximum distance covered toward gap fill (upward from todayOpen)
        const distanceCovered = candle.h - todayOpen
        if (distanceCovered > maxDistanceCovered) {
          maxDistanceCovered = distanceCovered
        }

        if (gapStatus === 'not filled') {
          const spikeDistance = todayOpen - candle.l
          if (spikeDistance > gapSpike) {
            gapSpike = spikeDistance
          }
        }

        if (candle.h >= previousClose && gapStatus === 'not filled') {
          gapStatus = 'filled'
          fillTime = new Date(candle.t).toISOString()
        }
      }
    }

    // Calculate percentage based on maximum distance covered relative to previous close
    gapFillPercentage = (maxDistanceCovered / previousClose) * 100
    gapFillPercentage = Math.max(0, gapFillPercentage)
  }

  const distanceToTarget = currentPrice - target

  let gapFillZone: 'above PSC' | 'below PSC' | 'at PSC'
  const priceThreshold = previousClose * 0.0001
  if (Math.abs(currentPrice - previousClose) < priceThreshold) {
    gapFillZone = 'at PSC'
  } else if (currentPrice > previousClose) {
    gapFillZone = 'above PSC'
  } else {
    gapFillZone = 'below PSC'
  }

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  return {
    symbol,
    price: currentPrice,
    gapType,
    gapSize,
    gapSizePercentage: parseFloat(Math.abs(gapSizePercentage).toFixed(2)),
    target,
    gapSpike: parseFloat(gapSpike.toFixed(2)),
    gapFillPercentage: parseFloat(gapFillPercentage.toFixed(2)),
    fillTime,
    distanceToTarget: parseFloat(distanceToTarget.toFixed(2)),
    gapStatus,
    gapFillZone,
    timestamp: new Date().toISOString()
  }
}
