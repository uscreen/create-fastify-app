export default (app, opts, next) => {
  app.get(
    '/noop',
    {
      schema: {
        response: {
          200: { $ref: 'noopNplugin#' } // fastest and json-schema spec compatiple way, or use 'app.getSchema()'
          // 200: app.getSchema('noopNplugin')
        }
      }
    },
    async (/* req, res */) => {
      return {
        noop: 'Hello world',
        plugin: app.noop(),
        property: 'should be stripped from response'
      }
    }
  )

  next()
}
