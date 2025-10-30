export type ORBPattern = 'breakout' | 'breakdown' | 'double_break' | 'no_break'

export interface Analysis {
  high: number
  low: number
  range: number
  rangePercent: number
  volume: number
  period: string
}

export interface BreakInfo {
  time: string
  date: string
  price: number
  minutesAfter: number
  volume: number
  barIndex: number
}

export interface BreaksData {
  hasBreakout: boolean
  hasBreakdown: boolean
  firstBreakout: BreakInfo | null
  firstBreakdown: BreakInfo | null
  timeBetweenBreaks: number | null
}

export interface DayMetrics {
  high: number
  low: number
  range: number
  volume: number
  capturedPercent: number
}

export interface ORBDayAnalysis {
  day: number
  date: string
  analysis: Analysis
  pattern: ORBPattern
  breaks: BreaksData
  dayMetrics: DayMetrics
}

export interface PatternCount {
  count: number
  percentage: number
}

interface ORBSummary {
  totalDays: number
  breakouts: PatternCount
  breakdowns: PatternCount
  doubleBreaks: PatternCount
  noBreaks: PatternCount
}

export interface ORBAnalysisResult {
  summary: ORBSummary
  details: ORBDayAnalysis[]
}
