// This file contains code that we reuse
// between our tests.

import Fastify from 'fastify'
import fp from 'fastify-plugin'

// setup to import YOUR app
import App from '../app/app.js'
import Config from '../app/config.js'

// overwrite some config option(s) on tests
Config.hemeralogLevel = 'fatal'
Config.hemeraNS = `test-${process.env.TAP_CHILD_ID}`

// automatically build and tear down our instance
export const build = async (t, featureSwitches = {}, ConfigOverwrite = {}) => {
  return new Promise((resolve, reject) => {
    const app = Fastify()

    // setup to register YOUR app
    app.register(fp(App), { ...Config, ...ConfigOverwrite })

    // tear down our app after we are done
    t.teardown(app.close.bind(app))

    app.ready((err) => {
      if (err) throw err
      resolve(app)
    })
  })
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
