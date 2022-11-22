import fp from 'fastify-plugin'
import S from 'fluent-json-schema'

/**
 * Usage of the Globaly Shared Schema feature
 */

export default fp((fastify, opts, next) => {
  const addSchema = (schema) => {
    fastify.addSchema(schema)
    return schema
  }

  /**
   * add generic schemas
   */
  const noop = addSchema(S.object().id('noop').prop('noop'))

  const plugin = addSchema(S.object().id('plugin').prop('plugin'))

  /**
   * combine and extend schemas
   */
  addSchema(
    S.object()
      .id('noopNplugin')
      .required(['noop'])
      // .prop('property') // --> strip it
      .extend(noop)
      .extend(plugin)
  )

  next()
})
