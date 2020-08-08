'use strict'

const fp = require('fastify-plugin')

module.exports = fp(
  (fastify, opts, next) => {
    fastify.decorate('noop', () => {
      return 'Hello Universe'
    })

    next()
  },
  {
    name: 'noop'
  }
)
