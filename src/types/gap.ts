export interface StockData {
  t: number
  o: number
  h: number
  l: number
  c: number
  v: number
  vw: number
}

export interface TodayGapReport {
  symbol: string
  price: number
  gapType: 'gap up' | 'gap down' | 'no gap'
  gapSize: number
  gapSizePercentage: number
  target: number
  gapSpike: number
  gapFillPercentage: number
  fillTime: string | null
  distanceToTarget: number
  gapStatus: 'filled' | 'not filled'
  gapFillZone: 'above PSC' | 'below PSC' | 'at PSC'
  timestamp: string
}

export interface Gap {
  type: 'gap_up' | 'gap_down'
  date: string
  gapIndex: number
  previousClose: number
  currentOpen: number
  gapSize: number
  gapSizePercent: number
  gapHigh: number
  gapLow: number
  filled: boolean
  filledDate: string | null
  filledIndex: number | null
  daysToFill: number | null
  partiallyFilled: boolean
  highestPriceAfterGap: number
  lowestPriceAfterGap: number
}

export interface GapResult {
  type: 'gap_up' | 'gap_down'
  date: string
  gapSize: number
  filled: boolean
}

export interface GapAnalysisReport {
  symbol: string
  summary: {
    totalGaps: number
    gapUpCount: number
    gapDownCount: number
    gapUpFilled: number
    gapUpNotFilled: number
    gapDownFilled: number
    gapDownNotFilled: number
  }
  gaps: GapResult[]
}
