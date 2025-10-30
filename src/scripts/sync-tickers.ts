import axios from 'axios'
import dotenv from 'dotenv'
import { TickerCreationAttributes } from 'src/models/ticker'
import { bulkUpsertTickers } from 'src/services/ticker'
import { config } from 'src/system/config'
import { initPostgreSQL, sequelize } from 'src/system/postgres'

// Load environment variables
dotenv.config()

interface PolygonTicker {
  ticker: string
  name: string
  market: string
  locale: string
  primary_exchange?: string
  type?: string
  active: boolean
  currency_name?: string
  cik?: string
  composite_figi?: string
  share_class_figi?: string
  last_updated_utc?: string
  delisted_utc?: string
}

interface PolygonResponse {
  results: PolygonTicker[]
  status: string
  count: number
  next_url?: string
}

/**
 * Fetch tickers from Polygon.io API
 */
async function fetchTickersFromPolygon(
  market: string = 'stocks',
  limit: number = 1000,
  nextUrl?: string
): Promise<PolygonResponse> {
  const url = nextUrl || 'https://api.polygon.io/v3/reference/tickers'

  console.log(`Fetching tickers from Polygon.io (market: ${market}, limit: ${limit})...`)

  const response = await axios.get<PolygonResponse>(url, {
    params: {
      market,
      active: true,
      limit,
      apiKey: config.polygon.apiKey
    }
  })

  if (!nextUrl && response.data.next_url) {
    response.data.next_url = `${response.data.next_url}&apiKey=${config.polygon.apiKey}`
  }

  return response.data
}

/**
 * Transform Polygon ticker to our database format
 */
function transformTicker(polygonTicker: PolygonTicker): TickerCreationAttributes {
  return {
    symbol: polygonTicker.ticker,
    name: polygonTicker.name,
    market: polygonTicker.market,
    locale: polygonTicker.locale,
    primaryExchange: polygonTicker.primary_exchange,
    type: polygonTicker.type,
    active: polygonTicker.active,
    currencyName: polygonTicker.currency_name,
    cik: polygonTicker.cik,
    compositeFigi: polygonTicker.composite_figi,
    shareClassFigi: polygonTicker.share_class_figi,
    lastUpdatedUtc: polygonTicker.last_updated_utc ? new Date(polygonTicker.last_updated_utc) : undefined,
    delistedUtc: polygonTicker.delisted_utc ? new Date(polygonTicker.delisted_utc) : undefined
  }
}

/**
 * Main sync function
 */
async function syncTickers(options: { market?: string; limit?: number; maxPages?: number | null }) {
  const { market = 'stocks', limit = 1000, maxPages = null } = options

  console.log('🚀 Starting ticker sync...')
  console.log(`Market: ${market}`)
  console.log(`Limit per page: ${limit}`)
  console.log(`Max pages: ${maxPages === null ? 'ALL (fetch until no more results)' : maxPages}`)
  console.log('-----------------------------------')

  try {
    // Initialize database connection
    await initPostgreSQL()

    let page = 1
    let nextUrl: string | undefined
    let totalProcessed = 0
    let totalCreated = 0
    let totalUpdated = 0

    do {
      console.log(`\n📄 Page ${page}${maxPages ? `/${maxPages}` : ''}`)

      // Fetch tickers from Polygon
      const response = await fetchTickersFromPolygon(market, limit, nextUrl)

      if (!response.results || response.results.length === 0) {
        console.log('No more tickers to process')
        break
      }

      console.log(`Received ${response.results.length} tickers`)

      // Transform and save to database
      const tickers = response.results.map(transformTicker)
      const result = await bulkUpsertTickers(tickers)

      totalCreated += result.created
      totalUpdated += result.updated
      totalProcessed += response.results.length

      console.log(`✅ Created: ${result.created}, Updated: ${result.updated}`)

      // Check if there's a next page
      nextUrl = response.next_url
      page++

      // Respect rate limits (5 requests per minute for free tier)
      if (nextUrl && (maxPages === null || page <= maxPages)) {
        console.log('⏳ Waiting 1 seconds to respect rate limits...')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } while (nextUrl && (maxPages === null || page <= maxPages))

    console.log('\n-----------------------------------')
    console.log('✅ Sync completed successfully!')
    console.log(`Total tickers processed: ${totalProcessed}`)
    console.log(`Total created: ${totalCreated}`)
    console.log(`Total updated: ${totalUpdated}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('\n❌ Error syncing tickers:', error.response?.data)
      console.error('API Error:', error.response?.data)
    }
    throw error
  } finally {
    // Close database connection
    if (sequelize) {
      await sequelize.close()
      console.log('\n✅ Database connection closed')
    }
  }
}

// Parse command line arguments
// stocks, crypto, fx, otc, indices
const args = process.argv.slice(2)
const market = args[0] || 'stocks'
const limit = args[1] ? parseInt(args[1], 10) : 1000
const maxPages = args[2] ? (args[2].toLowerCase() === 'all' ? null : parseInt(args[2], 10)) : null

console.log('\n' + '='.repeat(50))
console.log('📊 TICKER SYNC CONFIGURATION')
console.log('='.repeat(50))
console.log(`Market:    ${market}`)
console.log(`Per Page:  ${limit} tickers`)
if (maxPages === null) {
  console.log(`Max Pages: ALL (will fetch all available tickers)`)
  console.log(`Estimated: This may take several minutes...`)
} else {
  console.log(`Max Pages: ${maxPages} (will fetch up to ${maxPages * limit} tickers)`)
}
console.log('='.repeat(50))
console.log('\n💡 USAGE:')
console.log(`   npm run sync-tickers                     # Fetch ALL tickers`)
console.log(`   npm run sync-tickers stocks 1000 5       # Fetch 5 pages (5,000 tickers)`)
console.log(`   npm run sync-tickers stocks 1000 all     # Fetch ALL tickers (explicit)`)
console.log(`   npm run sync-tickers crypto 1000 all     # Fetch all crypto tickers\n`)

// Run the sync
syncTickers({ market, limit, maxPages })
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })
