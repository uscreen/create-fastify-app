'use strict'

const fastify = require('fastify')
const { name, version } = require('../package.json')
const config = require('./config')
const app = require('./app')

const server = fastify({
  logger: config.logEnabled
    ? {
        level: config.logLevel,
        name: `${name} (v${version}) ${process.env.NODE_APP_INSTANCE}`
      }
    : false
})

server.register(app, config)

/**
 * post-treatment
 */
server.ready(err => {
  if (err) throw err
  server.log.debug('server ready, routes are set:\n' + server.printRoutes())
})

/**
 * start http server
 */
server.listen(config.httpPort, config.httpBind)
