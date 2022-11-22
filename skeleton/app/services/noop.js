export default (fastify, opts, next) => {
  fastify.get(
    '/noop',
    {
      schema: {
        response: {
          200: { $ref: 'noopNplugin#' } // fastest and json-schema spec compatiple way, or use 'fastify.getSchema()'
          // 200: fastify.getSchema('noopNplugin')
        }
      }
    },
    async (req, res) => {
      return {
        noop: 'Hello world',
        plugin: fastify.noop(),
        property: 'should be stripped from response'
      }
    }
  )

  next()
}
