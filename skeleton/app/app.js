import fastifyApp from '@uscreen.de/fastify-app'
import fp from 'fastify-plugin'
import schemas from './schemas.js'

export default fp((fastify, opts, next) => {
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
