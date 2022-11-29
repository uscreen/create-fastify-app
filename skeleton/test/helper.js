// This file contains code that we reuse
// between our tests.

import Fastify from 'fastify'
import fp from 'fastify-plugin'

// setup to import YOUR app
import App from '../app/app.js'
import Config from '../app/config.js'

// automatically build and tear down our instance
export const build = async (t, ConfigOverwrite = {}) => {
  return new Promise((resolve) => {
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
