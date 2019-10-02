'use strict'

const fp = require('fastify-plugin')

/**
 * Usage of the Globaly Shared Schema feature
 */

module.exports = fp(async (fastify, opts, next) => {
  fastify.addSchema({
    $id: 'http200',
    type: 'object',
    properties: {
      statusCode: {
        type: 'integer',
        example: 200
      }
    }
  })

  fastify.addSchema({
    $id: 'http404',
    type: 'object',
    properties: {
      statusCode: {
        type: 'integer',
        example: 404
      },
      error: {
        type: 'string',
        example: 'Not Found'
      },
      message: {
        type: 'string',
        example: 'Not Found'
      }
    }
  })

  next()
})
