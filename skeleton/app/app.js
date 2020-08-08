'use strict'

const fastifyApp = require('@uscreen.de/fastify-app')
const fp = require('fastify-plugin')
const schemas = require('./schemas')

module.exports = fp((fastify, opts, next) => {
  /**
   * add schemas
   */
  fastify.register(schemas)

  /**
   * register app
   */
  fastify.register(fastifyApp, opts)

  next()
})
