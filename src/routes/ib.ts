import { analyzeInitialBalance } from 'src/controllers/ib'
import { createRouter } from 'src/utils/route-builder'

export default createRouter([{ method: 'get', path: '/', handler: analyzeInitialBalance }])
