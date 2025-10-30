import { Request } from 'express'
import { AuthRequest } from 'src/middleware/auth'

import * as userService from 'src/services/user'
import { isValidEmail } from 'src/utils'
import { ApiValidationError, NotFoundError, UnauthorizedError } from 'src/utils/errors'

export const registerUser = async (req: Request) => {
  const { email, password, firstName, lastName, role } = req.body

  // Validation
  if (!email || !isValidEmail(email)) {
    throw new ApiValidationError('Valid email is required')
  }

  if (!password || password.length < 8) {
    throw new ApiValidationError('Password must be at least 8 characters')
  }

  if (!firstName || !firstName.trim()) {
    throw new ApiValidationError('First name is required')
  }

  if (!lastName || !lastName.trim()) {
    throw new ApiValidationError('Last name is required')
  }

  if (role && !['user', 'trader', 'admin'].includes(role)) {
    throw new ApiValidationError('Invalid role')
  }

  const user = await userService.registerUser({
    email,
    password,
    firstName,
    lastName,
    role
  })

  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role
  }

  const token = userService.generateToken(tokenPayload)
  const refreshToken = userService.generateRefreshToken(tokenPayload)

  // Remove password from response
  const userResponse = { ...user.toJSON(), password: undefined }
  delete userResponse.password

  return {
    success: true,
    message: 'User registered successfully',
    data: {
      user: userResponse,
      token,
      refreshToken
    }
  }
}

export const loginUser = async (req: Request) => {
  const { email, password } = req.body

  // Validation
  if (!email || !isValidEmail(email)) {
    throw new ApiValidationError('Valid email is required')
  }

  if (!password) {
    throw new ApiValidationError('Password is required')
  }

  const { user, token, refreshToken } = await userService.loginUser({ email, password })

  // Remove password from response
  const userResponse = { ...user.toJSON(), password: undefined }
  delete userResponse.password

  return {
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      token,
      refreshToken
    }
  }
}

export const refreshToken = async (req: Request) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    throw new ApiValidationError('Refresh token is required')
  }

  const newToken = await userService.refreshAccessToken(refreshToken)

  return {
    success: true,
    data: {
      token: newToken
    }
  }
}

export const getProfile = async (req: AuthRequest) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required')
  }

  const user = await userService.getUserById(req.user.id)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return {
    success: true,
    data: { user: user.toJSON() }
  }
}

export const updateCurrentUser = async (req: AuthRequest) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required')
  }

  const { firstName, lastName, email } = req.body

  // Validation
  if (email && !isValidEmail(email)) {
    throw new ApiValidationError('Valid email is required')
  }

  const user = await userService.updateUser(req.user.id, {
    firstName,
    lastName,
    email
  })

  // Remove password from response
  const userResponse = { ...user.toJSON(), password: undefined }
  delete userResponse.password

  return {
    success: true,
    message: 'Profile updated successfully',
    data: { user: userResponse }
  }
}

export const updatePassword = async (req: AuthRequest) => {
  if (!req.user) {
    throw new UnauthorizedError('Authentication required')
  }

  const { currentPassword, newPassword } = req.body

  // Validation
  if (!currentPassword) {
    throw new ApiValidationError('Current password is required')
  }

  if (!newPassword || newPassword.length < 8) {
    throw new ApiValidationError('New password must be at least 8 characters')
  }

  await userService.changePassword(req.user.id, currentPassword, newPassword)

  return {
    success: true,
    message: 'Password changed successfully'
  }
}

export const listUsers = async (req: Request) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined
  const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined
  const role = req.query.role as string | undefined
  const isActive = req.query.isActive ? req.query.isActive === 'true' : undefined
  const search = req.query.search as string | undefined

  const { users, total } = await userService.getAllUsers({
    limit,
    offset,
    role,
    isActive,
    search
  })

  return {
    success: true,
    data: {
      users,
      total,
      limit: limit || 50,
      offset: offset || 0
    }
  }
}

export const getUser = async (req: Request) => {
  const userId = parseInt(req.params.id)

  if (isNaN(userId)) {
    throw new ApiValidationError('Invalid user ID')
  }

  const user = await userService.getUserById(userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return {
    success: true,
    data: { user: user.toJSON() }
  }
}

export const updateUserById = async (req: Request) => {
  const userId = parseInt(req.params.id)

  if (isNaN(userId)) {
    throw new ApiValidationError('Invalid user ID')
  }

  const { firstName, lastName, email, role, isActive, emailVerified } = req.body

  // Validation
  if (email && !isValidEmail(email)) {
    throw new ApiValidationError('Valid email is required')
  }

  if (role && !['user', 'trader', 'admin'].includes(role)) {
    throw new ApiValidationError('Invalid role')
  }

  const user = await userService.updateUser(userId, {
    firstName,
    lastName,
    email,
    role,
    isActive,
    emailVerified
  })

  // Remove password from response
  const userResponse = { ...user.toJSON(), password: undefined }
  delete userResponse.password

  return {
    success: true,
    message: 'User updated successfully',
    data: { user: userResponse }
  }
}

export const deleteUserById = async (req: Request) => {
  const userId = parseInt(req.params.id)

  if (isNaN(userId)) {
    throw new ApiValidationError('Invalid user ID')
  }

  await userService.deleteUser(userId)

  return {
    success: true,
    message: 'User deleted successfully'
  }
}

export const permanentlyDeleteUser = async (req: Request) => {
  const userId = parseInt(req.params.id)

  if (isNaN(userId)) {
    throw new ApiValidationError('Invalid user ID')
  }

  await userService.hardDeleteUser(userId)

  return {
    success: true,
    message: 'User permanently deleted'
  }
}

export const verifyUserEmail = async (req: Request) => {
  const userId = parseInt(req.params.id)

  if (isNaN(userId)) {
    throw new ApiValidationError('Invalid user ID')
  }

  await userService.verifyEmail(userId)

  return {
    success: true,
    message: 'Email verified successfully'
  }
}
