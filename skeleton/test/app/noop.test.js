import tap from 'tap'
import { build } from '../helper.js'

tap.test('Test Setup', (t) => {
  t.equal(true, true, 'Tests and assertions should work')
  t.end()
})

tap.test('Healthcheck', async (t) => {
  const fastify = await build(t)
  const { prefix } = fastify.config

  t.test('a valid GET Request', (t) => {
    fastify.inject(
      {
        method: 'GET',
        url: `${prefix}/health`
      },
      (e, response) => {
        t.error(e)
        t.same(response.statusCode, 200, 'response ok')
        t.same(JSON.parse(response.body), { status: 'ok' }, 'payload ok')
        t.end()
      }
    )
  })
})

tap.test('Noop Service', async (t) => {
  const fastify = await build(t)
  const { prefix } = fastify.config

  t.test('a valid GET Request', (t) => {
    fastify.inject(
      {
        method: 'GET',
        url: `${prefix}/noop`
      },
      (e, response) => {
        t.error(e)
        t.same(response.statusCode, 200, 'response ok')
        t.same(
          JSON.parse(response.body),
          {
            noop: 'Hello world',
            plugin: 'Hello Universe'
          },
          'payload ok'
        )
        t.end()
      }
    )
  })
})
