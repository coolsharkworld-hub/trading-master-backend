import {
  deleteUserById,
  getProfile,
  getUser,
  listUsers,
  loginUser,
  permanentlyDeleteUser,
  refreshToken,
  registerUser,
  updateCurrentUser,
  updatePassword,
  updateUserById,
  verifyUserEmail
} from 'src/controllers/user'
import { authenticate, authorize } from 'src/middleware/auth'
import { createRouter } from 'src/utils/route-builder'

const adminAuth = [authenticate, authorize('admin')]

export default createRouter([
  // Public routes
  { method: 'post', path: '/register', handler: registerUser },
  { method: 'post', path: '/login', handler: loginUser },
  { method: 'post', path: '/refresh', handler: refreshToken },

  // Authenticated user routes
  { method: 'get', path: '/profile', middleware: [authenticate], handler: getProfile },
  { method: 'put', path: '/profile', middleware: [authenticate], handler: updateCurrentUser },
  { method: 'put', path: '/password', middleware: [authenticate], handler: updatePassword },

  // Admin routes
  { method: 'get', path: '/all', middleware: adminAuth, handler: listUsers },
  { method: 'get', path: '/:id', middleware: adminAuth, handler: getUser },
  { method: 'put', path: '/:id', middleware: adminAuth, handler: updateUserById },
  { method: 'put', path: '/:id/verify-email', middleware: adminAuth, handler: verifyUserEmail },
  { method: 'delete', path: '/:id', middleware: adminAuth, handler: deleteUserById },
  { method: 'delete', path: '/:id/hard', middleware: adminAuth, handler: permanentlyDeleteUser }
])
