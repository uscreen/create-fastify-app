'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')

// setup to require YOUR app
const App = require('../app/app')
const Config = require('../app/config')

// automatically build and tear down our instance
function build(t, ConfigOverwrite = {}) {
  const app = Fastify()

  // setup to register YOUR app
  app.register(fp(App), { ...Config, ...ConfigOverwrite })

  // tear down our app after we are done
  t.tearDown(app.close.bind(app))

  return app
}

module.exports = {
  build
}
