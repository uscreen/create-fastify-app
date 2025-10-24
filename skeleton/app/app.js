import fastifyApp from '@uscreen.de/fastify-app'
import fp from 'fastify-plugin'
import schemas from './schemas.js'

export default fp((app, opts, next) => {
  /**
   * add schemas
   */
  app.register(schemas)

  /**
   * register app
   */
  app.register(fastifyApp, opts)

  next()
})
