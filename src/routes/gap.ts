import { analyzeGapData, analyzeTodayGap } from 'src/controllers/gap'
import { createRouter } from 'src/utils/route-builder'

export default createRouter([
  { method: 'get', path: '/', handler: analyzeGapData },
  { method: 'get', path: '/today', handler: analyzeTodayGap }
])
