import { Analysis, BreaksData, DayMetrics, PatternCount } from './orb'

export type IBPattern = 'single_break' | 'double_break' | 'no_break'

interface IBSummary {
  totalDays: number
  singleBreaks: PatternCount
  doubleBreaks: PatternCount
  noBreaks: PatternCount
}

export interface IBDayAnalysis {
  day: number
  date: string
  analysis: Analysis
  pattern: IBPattern
  breaks: BreaksData
  dayMetrics: DayMetrics
}

export interface IBAnalysisResult {
  summary: IBSummary
  details: IBDayAnalysis[]
}
