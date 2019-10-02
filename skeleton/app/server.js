'use strict'

const fastify = require('fastify')
const config = require('./config')
const myapp = require('./app')

const app = fastify({
  logger: config.logEnabled
    ? {
        level: config.logLevel
      }
    : false
})

app.register(myapp, config)

/**
 * post-treatment
 */
app.ready(err => {
  if (err) throw err
  app.log.debug('Application ready, routes are set:\n' + app.printRoutes())
})

/**
 * start http server
 */
app.listen(config.httpPort, config.httpBind)
