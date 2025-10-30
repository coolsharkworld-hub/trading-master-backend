import swaggerJsdoc from 'swagger-jsdoc'
import { config } from 'src/system/config'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trading Master API',
      version: '1.0.0',
      description: 'API documentation for Trading Master Backend - A comprehensive trading analysis platform',
      contact: {
        name: 'Trading Master Support',
        email: 'support@tradingmaster.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://38.143.58.174:${config.port}`,
        description: 'Test server'
      },
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server'
      },
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Development API base URL'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            error: {
              type: 'string',
              example: 'Error details'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            role: {
              type: 'string',
              enum: ['user', 'trader', 'admin'],
              example: 'user'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            emailVerified: {
              type: 'boolean',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Ticker: {
          type: 'object',
          properties: {
            symbol: {
              type: 'string',
              example: 'AAPL'
            },
            name: {
              type: 'string',
              example: 'Apple Inc.'
            },
            market: {
              type: 'string',
              example: 'stocks'
            },
            locale: {
              type: 'string',
              example: 'us'
            },
            primary_exchange: {
              type: 'string',
              example: 'NASDAQ'
            },
            type: {
              type: 'string',
              example: 'CS'
            },
            active: {
              type: 'boolean',
              example: true
            },
            currency_name: {
              type: 'string',
              example: 'usd'
            },
            cik: {
              type: 'string',
              example: '0000320193'
            },
            composite_figi: {
              type: 'string',
              example: 'BBG000B9XRY4'
            },
            share_class_figi: {
              type: 'string',
              example: 'BBG001S5N8V8'
            },
            last_updated_utc: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Access forbidden - insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'User',
        description: 'User authentication and management'
      },
      {
        name: 'Ticker',
        description: 'Stock ticker management'
      },
      {
        name: 'GAP',
        description: 'Gap analysis endpoints'
      },
      {
        name: 'ORB',
        description: 'Opening Range Breakout analysis'
      },
      {
        name: 'IB',
        description: 'Initial Balance analysis'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/docs/*.ts',
    './src/config/swagger.ts'
  ]
}

export const swaggerSpec = swaggerJsdoc(options)
