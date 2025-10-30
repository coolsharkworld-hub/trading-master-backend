/**
 * @swagger
 * /api/ticker:
 *   get:
 *     summary: List all tickers
 *     description: Get a paginated list of tickers with optional filters
 *     tags: [Ticker]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: market
 *         schema:
 *           type: string
 *         description: Filter by market type
 *         example: stocks
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by ticker type
 *         example: CS
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by symbol or name
 *     responses:
 *       200:
 *         description: List of tickers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticker'
 *                 total:
 *                   type: integer
 *                   example: 500
 *                 limit:
 *                   type: integer
 *                   example: 100
 *                 offset:
 *                   type: integer
 *                   example: 0
 *   post:
 *     summary: Create a new ticker
 *     description: Add a new ticker to the database
 *     tags: [Ticker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - name
 *               - market
 *             properties:
 *               symbol:
 *                 type: string
 *                 example: AAPL
 *               name:
 *                 type: string
 *                 example: Apple Inc.
 *               market:
 *                 type: string
 *                 example: stocks
 *               locale:
 *                 type: string
 *                 example: us
 *               primary_exchange:
 *                 type: string
 *                 example: NASDAQ
 *               type:
 *                 type: string
 *                 example: CS
 *               active:
 *                 type: boolean
 *                 example: true
 *               currency_name:
 *                 type: string
 *                 example: usd
 *               cik:
 *                 type: string
 *               composite_figi:
 *                 type: string
 *               share_class_figi:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticker created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Ticker created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticker'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/ticker/search:
 *   get:
 *     summary: Search tickers
 *     description: Search for tickers by symbol or name
 *     tags: [Ticker]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for symbol or name
 *         example: AAPL
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of results to return
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticker'
 *                 count:
 *                   type: integer
 *                   example: 5
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/ticker/stats:
 *   get:
 *     summary: Get ticker statistics
 *     description: Get statistics about tickers in the database
 *     tags: [Ticker]
 *     responses:
 *       200:
 *         description: Ticker statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Statistics object with various counts
 */

/**
 * @swagger
 * /api/ticker/market/{market}:
 *   get:
 *     summary: Get tickers by market type
 *     description: Get all tickers for a specific market
 *     tags: [Ticker]
 *     parameters:
 *       - in: path
 *         name: market
 *         required: true
 *         schema:
 *           type: string
 *         description: Market type
 *         example: stocks
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of tickers for the specified market
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticker'
 *                 total:
 *                   type: integer
 *                   example: 300
 *                 market:
 *                   type: string
 *                   example: stocks
 */

/**
 * @swagger
 * /api/ticker/{symbol}:
 *   get:
 *     summary: Get ticker by symbol
 *     description: Get detailed information for a specific ticker
 *     tags: [Ticker]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticker symbol
 *         example: AAPL
 *     responses:
 *       200:
 *         description: Ticker information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Ticker'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     summary: Update ticker
 *     description: Update an existing ticker's information
 *     tags: [Ticker]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticker symbol
 *         example: AAPL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               market:
 *                 type: string
 *               locale:
 *                 type: string
 *               primary_exchange:
 *                 type: string
 *               type:
 *                 type: string
 *               active:
 *                 type: boolean
 *               currency_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticker updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Ticker updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Ticker'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete ticker
 *     description: Remove a ticker from the database
 *     tags: [Ticker]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticker symbol
 *         example: AAPL
 *     responses:
 *       200:
 *         description: Ticker deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Ticker deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/ticker/bulk:
 *   post:
 *     summary: Bulk create or update tickers
 *     description: Create or update multiple tickers in a single request
 *     tags: [Ticker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tickers
 *             properties:
 *               tickers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - symbol
 *                     - name
 *                     - market
 *                   properties:
 *                     symbol:
 *                       type: string
 *                     name:
 *                       type: string
 *                     market:
 *                       type: string
 *                     locale:
 *                       type: string
 *                     primary_exchange:
 *                       type: string
 *                     type:
 *                       type: string
 *                     active:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Bulk operation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Bulk operation completed: 10 created, 5 updated'
 *                 data:
 *                   type: object
 *                   properties:
 *                     created:
 *                       type: integer
 *                       example: 10
 *                     updated:
 *                       type: integer
 *                       example: 5
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
