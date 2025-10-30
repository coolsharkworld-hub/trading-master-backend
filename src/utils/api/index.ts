import { Request, Response } from 'express'
import { ApiValidationError } from 'src/utils/errors'

const call = (process: (req: Request, res: Response) => Promise<unknown>) => (req: Request, res: Response) => {
  process(req, res)
    .then(data => {
      if (!res.headersSent) {
        res.json(data || { success: true })
      }
    })
    .catch(e => {
      console.log(`❌ Error:`, e)

      // Handle custom errors with statusCode property
      if (e.statusCode) {
        const statusCode = e.statusCode
        const response: {
          success: boolean
          message: string
          code?: number
          field?: string
        } = {
          success: false,
          message: e.message.replace(/\\u001b\[\d+m/g, '')
        }

        // Add additional fields for ApiValidationError
        if (e instanceof ApiValidationError) {
          if (e.code) response.code = e.code
          if (e.options.field) response.field = e.options.field
        }

        res.status(statusCode).json(response)
        return
      }

      // Handle unknown errors
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    })
}

export const api = { call }
