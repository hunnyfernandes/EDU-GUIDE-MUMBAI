/**
 * Swagger/OpenAPI Configuration
 * API Documentation setup using swagger-jsdoc and swagger-ui-express
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Edu Guide Mumbai API',
      version: '1.0.0',
      description: 'API documentation for Edu Guide Mumbai - A comprehensive college information system for Mumbai',
      contact: {
        name: 'API Support',
        email: 'support@eduguide.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.eduguide.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from /api/auth/login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', example: 1 },
            full_name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phone: { type: 'string', example: '9876543210' },
            role: { type: 'string', enum: ['student', 'admin'], example: 'student' },
            email_verified: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        College: {
          type: 'object',
          properties: {
            college_id: { type: 'integer', example: 1 },
            college_name: { type: 'string', example: 'St. Xavier\'s College' },
            college_code: { type: 'string', example: 'SXC001' },
            address: { type: 'string' },
            city: { type: 'string', example: 'Mumbai' },
            pincode: { type: 'string', example: '400001' },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email' },
            website: { type: 'string' },
            established_year: { type: 'integer', example: 1869 },
            college_type: { type: 'string', enum: ['Government', 'Private', 'Aided', 'Autonomous'] },
            affiliation: { type: 'string' },
            description: { type: 'string' },
            logo_url: { type: 'string' },
            cover_image_url: { type: 'string' },
            average_rating: { type: 'number', format: 'float', example: 4.5 },
            total_reviews: { type: 'integer', example: 125 },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        },
        Review: {
          type: 'object',
          properties: {
            review_id: { type: 'integer' },
            college_id: { type: 'integer' },
            user_id: { type: 'integer' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            review_title: { type: 'string' },
            review_text: { type: 'string' },
            course_studied: { type: 'string' },
            batch_year: { type: 'string' },
            is_verified: { type: 'boolean' },
            helpful_count: { type: 'integer' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: { type: 'object' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Authentication required. Please provide a valid token.'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Resource not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Validation failed',
                errors: {
                  email: 'Email is required',
                  password: 'Password must be at least 8 characters'
                }
              }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication endpoints' },
      { name: 'Colleges', description: 'College information endpoints' },
      { name: 'Reviews', description: 'College review endpoints' },
      { name: 'Users', description: 'User profile endpoints' },
      { name: 'Admin', description: 'Admin management endpoints' }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './server.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Edu Guide Mumbai API Documentation',
  customfavIcon: '/favicon.ico'
};

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerOptions
};











