'use strict'

module.exports = async fastify => {
  fastify.get('/noop', async (req, res) => {
    return { noop: 'Hello world', plugin: fastify.noop() }
  })
}
