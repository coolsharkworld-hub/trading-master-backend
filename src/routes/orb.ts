import { analyzeOpeningRange } from 'src/controllers/orb'
import { createRouter } from 'src/utils/route-builder'

export default createRouter([{ method: 'get', path: '/', handler: analyzeOpeningRange }])
