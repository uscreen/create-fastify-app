import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from '../helper.js'

test('Test Setup', (t, done) => {
  assert.equal(true, true, 'Tests and assertions should work')
  done()
})

test('Healthcheck', async (t) => {
  const app = await build(t)
  const { prefix } = app.config

  t.test('a valid GET Request', (t, done) => {
    app.inject(
      {
        method: 'GET',
        url: `${prefix}/health`
      },
      (e, response) => {
        assert.ok(!e)
        assert.equal(response.statusCode, 200, 'response ok')
        assert.deepEqual(
          JSON.parse(response.body),
          { status: 'ok' },
          'payload ok'
        )
        done()
      }
    )
  })
})

test('Noop Service', async (t) => {
  const app = await build(t)
  const { prefix } = app.config

  t.test('a valid GET Request', (t, done) => {
    app.inject(
      {
        method: 'GET',
        url: `${prefix}/noop`
      },
      (e, response) => {
        assert.ok(!e)
        assert.equal(response.statusCode, 200, 'response ok')
        assert.deepEqual(
          JSON.parse(response.body),
          {
            noop: 'Hello world',
            plugin: 'Hello Universe'
          },
          'payload ok'
        )
        done()
      }
    )
  })
})
