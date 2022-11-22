import fp from 'fastify-plugin'

export default fp(
  (fastify, opts, next) => {
    fastify.decorate('noop', () => {
      return 'Hello Universe'
    })

    next()
  },
  {
    name: 'noop'
  }
)
