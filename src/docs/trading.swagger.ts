/**
 * @swagger
 * /api/gap:
 *   get:
 *     summary: Analyze gap data
 *     description: Get gap analysis for specified ticker and date range
 *     tags: [GAP]
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ticker symbol
 *         example: SPY
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analysis (YYYY-MM-DD)
 *         example: '2025-10-01'
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analysis (YYYY-MM-DD)
 *         example: '2025-10-23'
 *     responses:
 *       200:
 *         description: Gap analysis results
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
 *                   properties:
 *                     symbol:
 *                       type: string
 *                       example: SPY
 *                     from:
 *                       type: string
 *                       example: '2025-10-01'
 *                     to:
 *                       type: string
 *                       example: '2025-10-23'
 *                     gaps:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           gapPercent:
 *                             type: number
 *                           gapDirection:
 *                             type: string
 *                             enum: [up, down]
 *                           openPrice:
 *                             type: number
 *                           previousClose:
 *                             type: number
 *                           gapFilled:
 *                             type: boolean
 *                           fillTime:
 *                             type: string
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalGaps:
 *                           type: integer
 *                         gapsUp:
 *                           type: integer
 *                         gapsDown:
 *                           type: integer
 *                         averageGapPercent:
 *                           type: number
 *                         gapsFilled:
 *                           type: integer
 *                         fillRate:
 *                           type: number
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/gap/today:
 *   get:
 *     summary: Analyze today's gap
 *     description: Get gap analysis for today's trading session
 *     tags: [GAP]
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ticker symbol
 *         example: SPY
 *     responses:
 *       200:
 *         description: Today's gap analysis
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
 *                   properties:
 *                     symbol:
 *                       type: string
 *                       example: SPY
 *                     date:
 *                       type: string
 *                       format: date
 *                     gapPercent:
 *                       type: number
 *                       example: 0.75
 *                     gapDirection:
 *                       type: string
 *                       enum: [up, down]
 *                       example: up
 *                     openPrice:
 *                       type: number
 *                       example: 425.50
 *                     previousClose:
 *                       type: number
 *                       example: 422.30
 *                     currentPrice:
 *                       type: number
 *                       example: 426.80
 *                     gapFilled:
 *                       type: boolean
 *                       example: false
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/orb:
 *   get:
 *     summary: Analyze Opening Range Breakout
 *     description: Analyze opening range breakout patterns for specified parameters
 *     tags: [ORB]
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ticker symbol
 *         example: SPY
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analysis (YYYY-MM-DD)
 *         example: '2025-10-01'
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analysis (YYYY-MM-DD)
 *         example: '2025-10-23'
 *       - in: query
 *         name: orMinutes
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Number of minutes for opening range
 *         example: 15
 *     responses:
 *       200:
 *         description: ORB analysis results
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
 *                   properties:
 *                     symbol:
 *                       type: string
 *                       example: SPY
 *                     from:
 *                       type: string
 *                     to:
 *                       type: string
 *                     orMinutes:
 *                       type: integer
 *                       example: 15
 *                     breakouts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           orbHigh:
 *                             type: number
 *                           orbLow:
 *                             type: number
 *                           orbRange:
 *                             type: number
 *                           breakoutDirection:
 *                             type: string
 *                             enum: [up, down, none]
 *                           breakoutTime:
 *                             type: string
 *                           breakoutPrice:
 *                             type: number
 *                           maxProfit:
 *                             type: number
 *                           maxLoss:
 *                             type: number
 *                           closePrice:
 *                             type: number
 *                           profitLoss:
 *                             type: number
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalDays:
 *                           type: integer
 *                         breakoutsUp:
 *                           type: integer
 *                         breakoutsDown:
 *                           type: integer
 *                         noBreakout:
 *                           type: integer
 *                         successRate:
 *                           type: number
 *                         averageRange:
 *                           type: number
 *                         averageProfit:
 *                           type: number
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/ib:
 *   get:
 *     summary: Analyze Initial Balance
 *     description: Analyze initial balance patterns for specified parameters
 *     tags: [IB]
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock ticker symbol
 *         example: SPY
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analysis (YYYY-MM-DD)
 *         example: '2025-10-01'
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analysis (YYYY-MM-DD)
 *         example: '2025-10-23'
 *       - in: query
 *         name: orMinutes
 *         schema:
 *           type: integer
 *           default: 60
 *         description: Number of minutes for initial balance period
 *         example: 60
 *     responses:
 *       200:
 *         description: Initial Balance analysis results
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
 *                   properties:
 *                     symbol:
 *                       type: string
 *                       example: SPY
 *                     from:
 *                       type: string
 *                     to:
 *                       type: string
 *                     orMinutes:
 *                       type: integer
 *                       example: 60
 *                     sessions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           ibHigh:
 *                             type: number
 *                           ibLow:
 *                             type: number
 *                           ibRange:
 *                             type: number
 *                           breakDirection:
 *                             type: string
 *                             enum: [up, down, none]
 *                           extension:
 *                             type: number
 *                             description: How far price extended beyond IB
 *                           extensionPercent:
 *                             type: number
 *                           dayHigh:
 *                             type: number
 *                           dayLow:
 *                             type: number
 *                           closePrice:
 *                             type: number
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalSessions:
 *                           type: integer
 *                         breaksUp:
 *                           type: integer
 *                         breaksDown:
 *                           type: integer
 *                         stayInRange:
 *                           type: integer
 *                         averageRange:
 *                           type: number
 *                         averageExtension:
 *                           type: number
 *                         successfulBreakoutRate:
 *                           type: number
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
