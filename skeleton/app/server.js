import fastify from 'fastify'
import hyperid from 'hyperid'
import config from './config.js'
import app from './app.js'
import { json } from './modules/common-esm.js'

const { name, version } = json(import.meta.url, '../package.json')

const instance = hyperid({ urlSafe: true })

const server = fastify({
  genReqId() {
    return instance()
  },

  logger: config.logEnabled
    ? {
        level: config.logLevel,
        name: `${name} (v${version}) ${process.env.NODE_APP_INSTANCE}`,
        redact: {
          paths: ['pattern'], // limit hemeras verbosity
          remove: true
        }
      }
    : false
})

server.register(app, config)

/**
 * post-treatment
 */
server.ready((err) => {
  if (err) throw err
  server.log.debug('server ready, routes are set:\n' + server.printRoutes())
})

/**
 * graceful shutdown (closing handles, etc.)
 */
process.on('SIGINT', async () => {
  server.log.info(`server shutting down.`)
  await server.close()
  process.exit()
})

/**
 * start http server
 */
server.listen({ port: config.httpPort, host: config.httpBind })
