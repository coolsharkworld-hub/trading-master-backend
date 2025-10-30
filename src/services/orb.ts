import moment from 'moment-timezone'
import { config } from 'src/system'
import { StockData } from 'src/types/gap'
import { BreakInfo, BreaksData, ORBAnalysisResult, ORBDayAnalysis, ORBPattern } from 'src/types/orb'
import { addMinutes, formatDate, formatTime } from 'src/utils'

const MARKET_OPEN_MINUTES = 9 * 60 + 30
const MARKET_CLOSE_MINUTES = 16 * 60
const MS_PER_MINUTE = 60000

export const detectBreaks = (
  allBars: StockData[],
  startIdx: number,
  high: number,
  low: number,
  endTime: number
): BreaksData => {
  let firstBreakout: BreakInfo | null = null
  let firstBreakdown: BreakInfo | null = null

  for (let i = startIdx; i < allBars.length; i++) {
    const bar = allBars[i]

    if (!firstBreakout && bar.h > high) {
      firstBreakout = {
        time: formatTime(bar.t),
        date: formatDate(bar.t),
        price: Math.round(bar.h * 100) / 100,
        minutesAfter: Math.round((bar.t - endTime) / MS_PER_MINUTE),
        volume: bar.v,
        barIndex: i
      }
    }

    if (!firstBreakdown && bar.l < low) {
      firstBreakdown = {
        time: formatTime(bar.t),
        date: formatDate(bar.t),
        price: Math.round(bar.l * 100) / 100,
        minutesAfter: Math.round((bar.t - endTime) / MS_PER_MINUTE),
        volume: bar.v,
        barIndex: i
      }
    }

    if (firstBreakout && firstBreakdown) break
  }

  return {
    hasBreakout: firstBreakout !== null,
    hasBreakdown: firstBreakdown !== null,
    firstBreakout,
    firstBreakdown,
    timeBetweenBreaks:
      firstBreakout && firstBreakdown ? Math.abs(firstBreakout.minutesAfter - firstBreakdown.minutesAfter) : null
  }
}

const analyzeSingleDayORB = (dayStockData: StockData[], dayIndex: number, minutes: number): ORBDayAnalysis => {
  let high = -Infinity
  let low = Infinity
  let volume = 0

  for (let i = 0; i < minutes; i++) {
    const bar = dayStockData[i]
    if (bar.h > high) high = bar.h
    if (bar.l < low) low = bar.l
    volume += bar.v
  }

  const range = high - low
  const rangePercent = (range / low) * 100
  const endTime = dayStockData[minutes - 1].t

  const breakInfo = detectBreaks(dayStockData, minutes, high, low, endTime)

  // Determine pattern with single conditional
  const pattern: ORBPattern =
    breakInfo.hasBreakout && breakInfo.hasBreakdown
      ? 'double_break'
      : breakInfo.hasBreakout
        ? 'breakout'
        : breakInfo.hasBreakdown
          ? 'breakdown'
          : 'no_break'

  // Calculate day metrics in a single loop
  let dayHigh = high
  let dayLow = low
  let dayVolume = volume

  for (let i = minutes; i < dayStockData.length; i++) {
    const bar = dayStockData[i]
    if (bar.h > dayHigh) dayHigh = bar.h
    if (bar.l < dayLow) dayLow = bar.l
    dayVolume += bar.v
  }

  const dayRange = dayHigh - dayLow

  return {
    day: dayIndex + 1,
    date: formatDate(dayStockData[0].t),
    analysis: {
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      range: Math.round(range * 100) / 100,
      rangePercent: Math.round(rangePercent * 100) / 100,
      volume,
      period: addMinutes('09:30', minutes)
    },
    pattern,
    breaks: breakInfo,
    dayMetrics: {
      high: Math.round(dayHigh * 100) / 100,
      low: Math.round(dayLow * 100) / 100,
      range: Math.round(dayRange * 100) / 100,
      volume: dayVolume,
      capturedPercent: Math.round((range / dayRange) * 1000) / 10
    }
  }
}

export const analyzeMinsORB = (allDaysData: StockData[][], minutes: number): ORBAnalysisResult => {
  const patternCounts = { breakout: 0, breakdown: 0, double_break: 0, no_break: 0 }
  const details: ORBDayAnalysis[] = new Array(allDaysData.length)

  for (let dayIndex = 0; dayIndex < allDaysData.length; dayIndex++) {
    const analysis = analyzeSingleDayORB(allDaysData[dayIndex], dayIndex, minutes)
    patternCounts[analysis.pattern]++
    details[dayIndex] = analysis
  }

  const total = allDaysData.length

  return {
    summary: {
      totalDays: total,
      breakouts: {
        count: patternCounts.breakout,
        percentage: (patternCounts.breakout / total) * 100
      },
      breakdowns: {
        count: patternCounts.breakdown,
        percentage: (patternCounts.breakdown / total) * 100
      },
      doubleBreaks: {
        count: patternCounts.double_break,
        percentage: (patternCounts.double_break / total) * 100
      },
      noBreaks: {
        count: patternCounts.no_break,
        percentage: (patternCounts.no_break / total) * 100
      }
    },
    details
  }
}

export const filterMarketHours = (minuteData: StockData[]): StockData[][] => {
  const dayMap = new Map<string, StockData[]>()
  const today = moment().tz(config.timezone).format('YYYY-MM-DD')

  for (const bar of minuteData) {
    const barMoment = moment(bar.t).tz(config.timezone)
    const date = barMoment.format('YYYY-MM-DD')

    if (date === today) continue

    const etHour = barMoment.hour()
    const etMinute = barMoment.minute()
    const etTimeInMinutes = etHour * 60 + etMinute

    if (etTimeInMinutes >= MARKET_OPEN_MINUTES && etTimeInMinutes < MARKET_CLOSE_MINUTES) {
      if (!dayMap.has(date)) {
        dayMap.set(date, [])
      }
      dayMap.get(date)!.push(bar)
    }
  }

  const result: StockData[][] = []
  dayMap.forEach(bars => {
    result.push(bars.sort((a, b) => a.t - b.t))
  })

  return result
}
