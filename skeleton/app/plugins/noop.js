import fp from 'fastify-plugin'

export default fp(
  (app, opts, next) => {
    app.decorate('noop', () => {
      return 'Hello Universe'
    })

    next()
  },
  {
    name: 'noop'
  }
)
