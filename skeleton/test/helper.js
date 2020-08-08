'use strict'

// This file contains code that we reuse
// between our tests.

const Fastify = require('fastify')
const fp = require('fastify-plugin')

// setup to require YOUR app
const App = require('../app/app')
const Config = require('../app/config')

// overwrite some config option(s) on tests
Config.hemeralogLevel = 'fatal'
Config.hemeraNS = `test-${process.env.TAP_CHILD_ID}`

// automatically build and tear down our instance
const build = async (t, featureSwitches = {}, ConfigOverwrite = {}) => {
  return new Promise((resolve, reject) => {
    const app = Fastify()

    // setup to register YOUR app
    app.register(fp(App), { ...Config, ...ConfigOverwrite })

    // tear down our app after we are done
    t.tearDown(app.close.bind(app))

    app.ready((err) => {
      if (err) throw err
      resolve(app)
    })
  })
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = {
  build,
  wait
}
