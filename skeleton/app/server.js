import process from 'node:process'
import { options } from '@uscreen.de/fastify-app'
import fastify from 'fastify'
import app from './app.js'

import config from './config.js'

const server = fastify(options(config))

server.register(app, config)

/**
 * post-treatment
 */
server.ready((err) => {
  if (err) {
    throw err
  }
  server.log.debug(
    `server ready, routes are set:\n${
      server.printRoutes({ commonPrefix: false })}`
  )
})

/**
 * graceful shutdown (closing handles, etc.)
 */
const shutdown = async () => {
  server.log.info(
    `application shutting down. (${server.app.name} ${server.app.version})`
  )
  await server.close()
  process.exit()
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

/**
 * start http server
 */
server.listen({ port: config.httpPort, host: config.httpBind })
