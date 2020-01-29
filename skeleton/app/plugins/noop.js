'use strict'

const fp = require('fastify-plugin')

module.exports = fp(
  async (fastify, opts, next) => {
    fastify.decorate('noop', () => {
      return 'Hello Universe'
    })

    next()
  },
  {
    name: 'noop'
  }
)
