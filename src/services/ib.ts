import { StockData } from 'src/types/gap'
import { IBAnalysisResult, IBDayAnalysis, IBPattern } from 'src/types/ib'
import { addMinutes, formatDate } from 'src/utils'
import { detectBreaks } from './orb'

const analyzeSingleDayIB = (dayStockData: StockData[], dayIndex: number, minutes: number): IBDayAnalysis => {
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
  const pattern: IBPattern =
    breakInfo.hasBreakout && breakInfo.hasBreakdown
      ? 'double_break'
      : breakInfo.hasBreakout || breakInfo.hasBreakdown
        ? 'single_break'
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

export const analyzeMinsIB = (allDaysData: StockData[][], minutes: number): IBAnalysisResult => {
  const patternCounts = { single_break: 0, double_break: 0, no_break: 0 }
  const details: IBDayAnalysis[] = new Array(allDaysData.length)

  for (let dayIndex = 0; dayIndex < allDaysData.length; dayIndex++) {
    const analysis = analyzeSingleDayIB(allDaysData[dayIndex], dayIndex, minutes)
    patternCounts[analysis.pattern]++
    details[dayIndex] = analysis
  }

  const total = allDaysData.length
  const singleBreaks = patternCounts.single_break

  return {
    summary: {
      totalDays: total,
      singleBreaks: {
        count: singleBreaks,
        percentage: (singleBreaks / total) * 100
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
