import { StockData } from './gap'

export interface PolygonAggregateResponse {
  ticker?: string
  results?: StockData[]
  status?: string
  error?: string
  queryCount?: number
  resultsCount?: number
  adjusted?: boolean
}
