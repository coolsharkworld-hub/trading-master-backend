import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from 'src/models/user'
import { config } from 'src/system/config'

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

/**
 * Middleware to verify JWT token
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided. Authentication required.' })
      return
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: number
      email: string
      role: string
    }

    // Check if user still exists and is active
    const user = await User.findOne({
      where: { id: decoded.id, isActive: true }
    })

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found or inactive.' })
      return
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, message: 'Invalid token.' })
      return
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expired.' })
      return
    }
    res.status(500).json({ success: false, message: 'Authentication error.' })
    return
  }
}

/**
 * Middleware to check if user has required role(s)
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Insufficient permissions.' })
      return
    }

    next()
  }
}

/**
 * Middleware to check if user is admin
 */
export const isAdmin = authorize('admin')

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: number
      email: string
      role: string
    }

    const user = await User.findOne({
      where: { id: decoded.id, isActive: true }
    })

    if (user) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      }
    }

    next()
  } catch {
    // Continue without authentication
    next()
  }
}
