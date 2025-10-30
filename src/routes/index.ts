import { Router } from 'express'
import gap from './gap'
import ib from './ib'
import orb from './orb'
import ticker from './ticker'
import user from './user'

const router = Router()

router.use('/gap', gap)
router.use('/orb', orb)
router.use('/ib', ib)
router.use('/ticker', ticker)
router.use('/user', user)

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API and its services
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

export default router
