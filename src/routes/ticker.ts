import {
  bulkUpsertTickers,
  createTicker,
  deleteTicker,
  getTicker,
  getTickersByMarketType,
  getTickerStats,
  listTickers,
  searchTickers,
  updateTicker
} from 'src/controllers/ticker'
import { createRouter } from 'src/utils/route-builder'

export default createRouter([
  { method: 'get', path: '/', handler: listTickers },
  { method: 'get', path: '/search', handler: searchTickers },
  { method: 'get', path: '/stats', handler: getTickerStats },
  { method: 'get', path: '/market/:market', handler: getTickersByMarketType },
  { method: 'get', path: '/:symbol', handler: getTicker },
  { method: 'post', path: '/', handler: createTicker },
  { method: 'post', path: '/bulk', handler: bulkUpsertTickers },
  { method: 'put', path: '/:symbol', handler: updateTicker },
  { method: 'delete', path: '/:symbol', handler: deleteTicker }
])
