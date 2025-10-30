import bcrypt from 'bcryptjs'
import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { Op, WhereOptions } from 'sequelize'
import { User, UserCreationAttributes } from 'src/models/user'
import { config } from 'src/system/config'
import { ApiValidationError } from 'src/utils/errors'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
}

export interface UpdateUserData {
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  isActive?: boolean
  emailVerified?: boolean
}

export interface TokenPayload {
  id: number
  email: string
  role: string
}

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

/**
 * Generate JWT token
 */
export const generateToken = (payload: TokenPayload, expiresIn?: string): string => {
  const options: SignOptions = { expiresIn: (expiresIn || config.jwt.expiresIn) as SignOptions['expiresIn'] }
  return jwt.sign(payload, config.jwt.secret as Secret, options)
}

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: config.jwt.refreshExpiresIn as SignOptions['expiresIn'] }
  return jwt.sign(payload, config.jwt.secret as Secret, options)
}

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.secret) as TokenPayload
}

/**
 * Register a new user
 */
export const registerUser = async (data: RegisterData): Promise<User> => {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email: data.email } })
  if (existingUser) {
    throw new ApiValidationError('User with this email already exists')
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password)

  // Create user
  const userData: UserCreationAttributes = {
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role || 'user',
    isActive: true,
    emailVerified: false
  }

  const user = await User.create(userData)
  return user
}

/**
 * Login user
 */
export const loginUser = async (
  credentials: LoginCredentials
): Promise<{ user: User; token: string; refreshToken: string }> => {
  // Find user by email
  const user = await User.findOne({ where: { email: credentials.email } })
  if (!user) {
    throw new ApiValidationError('Invalid credentials')
  }

  const { id, email, role, isActive, password } = user.toJSON()

  // Check if user is active
  if (!isActive) {
    throw new ApiValidationError('Account is inactive')
  }

  // Verify password
  const isPasswordValid = await comparePassword(credentials.password, password)
  if (!isPasswordValid) {
    throw new ApiValidationError('Invalid credentials')
  }

  // Update last login
  await user.update({ lastLogin: new Date() })

  // Generate tokens
  const tokenPayload: TokenPayload = { id, email, role }

  const token = generateToken(tokenPayload)
  const refreshToken = generateRefreshToken(tokenPayload)

  return { user, token, refreshToken }
}

/**
 * Get user by ID
 */
export const getUserById = async (id: number): Promise<User | null> => {
  return User.findByPk(id, {
    attributes: { exclude: ['password'] }
  })
}

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return User.findOne({
    where: { email },
    attributes: { exclude: ['password'] }
  })
}

/**
 * Update user
 */
export const updateUser = async (id: number, data: UpdateUserData): Promise<User> => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new ApiValidationError('User not found')
  }

  // Check if email is being changed and if it's already taken
  if (data.email && data.email !== user.email) {
    const existingUser = await User.findOne({ where: { email: data.email } })
    if (existingUser) {
      throw new ApiValidationError('Email already in use')
    }
  }

  await user.update(data)
  return user
}

/**
 * Change user password
 */
export const changePassword = async (id: number, currentPassword: string, newPassword: string): Promise<void> => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new ApiValidationError('User not found')
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.toJSON().password)
  if (!isPasswordValid) {
    throw new ApiValidationError('Current password is incorrect')
  }

  // Hash and update new password
  const hashedPassword = await hashPassword(newPassword)
  await user.update({ password: hashedPassword })
}

/**
 * Delete user (soft delete by setting inactive)
 */
export const deleteUser = async (id: number): Promise<void> => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new ApiValidationError('User not found')
  }

  await user.update({ isActive: false })
}

/**
 * Hard delete user
 */
export const hardDeleteUser = async (id: number): Promise<void> => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new ApiValidationError('User not found')
  }

  await user.destroy()
}

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (options?: {
  limit?: number
  offset?: number
  role?: string
  isActive?: boolean
  search?: string
}): Promise<{ users: User[]; total: number }> => {
  const where: Record<PropertyKey, unknown> = {}

  if (options?.role) {
    where.role = options.role
  }

  if (options?.isActive !== undefined) {
    where.isActive = options.isActive
  }

  if (options?.search) {
    where[Op.or] = [
      { email: { [Op.iLike]: `%${options.search}%` } },
      { firstName: { [Op.iLike]: `%${options.search}%` } },
      { lastName: { [Op.iLike]: `%${options.search}%` } }
    ]
  }

  const { count, rows } = await User.findAndCountAll({
    where: where as WhereOptions,
    attributes: { exclude: ['password'] },
    limit: options?.limit || 50,
    offset: options?.offset || 0,
    order: [['createdAt', 'DESC']]
  })

  return { users: rows, total: count }
}

/**
 * Verify email
 */
export const verifyEmail = async (id: number): Promise<void> => {
  const user = await User.findByPk(id)
  if (!user) {
    throw new ApiValidationError('User not found')
  }

  await user.update({ emailVerified: true })
}

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    const payload = verifyToken(refreshToken)

    // Verify user still exists and is active
    const user = await User.findOne({
      where: { id: payload.id, isActive: true }
    })

    if (!user) {
      throw new ApiValidationError('User not found or inactive')
    }

    // Generate new access token
    const newTokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    return generateToken(newTokenPayload)
  } catch {
    throw new ApiValidationError('Invalid refresh token')
  }
}
