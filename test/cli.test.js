import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'fs-extra'
import path from 'path'
import { createRequire } from 'module'
import stripAnsi from 'strip-ansi'
import { before, after, cli, cwd } from './setup.js'

const require = createRequire(import.meta.url)
const { version } = require('../package.json')

test.before(before)
test.after(after)

test('`$ cli` should print error message', async (t) => {
  const result = await cli([])
  assert.equal(
    true,
    result.stderr.startsWith("error: missing required argument 'name'"),
    'Should print error message'
  )
})

test('`$ cli -V` should show correct version', async (t) => {
  const result = await cli(['--version'])
  assert.equal(true, result.stdout.startsWith(version))
})

test('`$ cli new-app` should succeed', async (t) => {
  const result = await cli(['new-app'])
  /**
   * check output
   */
  assert.equal(0, result.code, 'Should succeed')

  await t.test('Check output', (t, done) => {
    const expectedOut = [
      `Initialized empty Git repository in ${path.resolve(
        cwd,
        'new-app',
        '.git'
      )}`,
      'success Saved package.json'
    ]

    const stdout = stripAnsi(result.stdout)

    for (const e of expectedOut) {
      assert.equal(true, stdout.includes(e), `"${e.substring(0, 36)}"`)
    }

    done()
  })

  /**
   * check files
   */
  await t.test('Check files', (t, done) => {
    const appPath = path.resolve(cwd, 'new-app')

    assert.ok(
      fs.existsSync(path.resolve(appPath, 'package.json')),
      'package.json was created'
    )
    assert.ok(
      fs.existsSync(path.resolve(appPath, 'README.md')),
      'skeleton was copied'
    )
    assert.ok(fs.existsSync(path.resolve(appPath, '.env')), 'Env was copied')

    const pack = JSON.parse(
      fs.readFileSync(path.resolve(appPath, 'package.json'), {
        encoding: 'utf-8'
      })
    )
    assert.ok(
      pack.name !== 'new-fastify-app',
      'package.json was not just copied from skeleton'
    )
    assert.ok(
      pack.main === 'app/server.js',
      'package.json was correctly enriched with data'
    )

    done()
  })
})
