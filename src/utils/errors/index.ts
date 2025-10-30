class BaseError extends Error {
  override message: string
  args: string[]
  statusCode: number

  constructor(message: string, args: string[] = [], statusCode: number = 500) {
    super()
    this.message = message
    this.args = args
    this.statusCode = statusCode
  }
}

export class InternalError extends BaseError {
  constructor(message: string = 'Internal server error', args: string[] = []) {
    super(message, args, 500)
  }
}

export class LockedProcessError extends BaseError {
  constructor(message: string, args: string[] = []) {
    super(message, args, 423)
  }
}

export class ApiValidationError extends BaseError {
  code?: number
  options: { field?: string }

  constructor(message: string, args: string[] = [], options: { field?: string } = {}) {
    super(message, args, 400)
    this.options = options

    if (message === 'not_enough_balance') {
      this.code = 1001
    }
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = 'Unauthorized', args: string[] = []) {
    super(message, args, 401)
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string = 'Forbidden', args: string[] = []) {
    super(message, args, 403)
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = 'Not found', args: string[] = []) {
    super(message, args, 404)
  }
}

export class ConflictError extends BaseError {
  constructor(message: string = 'Conflict', args: string[] = []) {
    super(message, args, 409)
  }
}
