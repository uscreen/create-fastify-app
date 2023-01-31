import tap from 'tap'
import fs from 'fs-extra'
import path from 'path'
import { createRequire } from 'module'
import stripAnsi from 'strip-ansi'
import { before, teardown, cli, cwd } from './setup.js'

const require = createRequire(import.meta.url)
const { version } = require('../package.json')

tap.before(before)
tap.teardown(teardown)

tap.test('$ cli', async (t) => {
  const result = await cli([])
  t.equal(
    true,
    result.stderr.startsWith("error: missing required argument 'name'"),
    'Should print error message'
  )

  t.end()
})

tap.test('$ cli -V', async (t) => {
  const result = await cli(['--version'])
  t.equal(
    true,
    result.stdout.startsWith(version),
    'Should show correct version'
  )

  t.end()
})

tap.test('$ cli new-app -y', async (t) => {
  const result = await cli(['new-app', '-y'])

  /**
   * check output
   */
  t.equal(0, result.code, 'Should succeed')

  t.test('Check output', (t) => {
    const expectedOut = [
      `Initialized empty Git repository in ${path.resolve(
        cwd,
        'new-app',
        '.git'
      )}`,
      'success Saved package.json',
      '[1/4] Resolving packages...',
      '[2/4] Fetching packages...',
      '[3/4] Linking dependencies...',
      '[4/4] Building fresh packages...',
      'success Saved lockfile.',
      'husky - Git hooks installed'
    ]

    const stdout = stripAnsi(result.stdout)

    for (const e of expectedOut) {
      t.equal(true, stdout.includes(e), `"${e.substring(0, 36)}"`)
    }

    t.end()
  })

  /**
   * check files
   */
  t.test('Check files', (t) => {
    const appPath = path.resolve(cwd, 'new-app')

    t.equal(
      true,
      fs.existsSync(path.resolve(appPath, 'package.json')),
      'package.json was created'
    )
    t.equal(
      true,
      fs.existsSync(path.resolve(appPath, 'README.md')),
      'skeleton was copied'
    )
    t.equal(
      true,
      fs.existsSync(path.resolve(appPath, 'yarn.lock')),
      'Packages were installed'
    )

    const pack = JSON.parse(
      fs.readFileSync(path.resolve(appPath, 'package.json'), {
        encoding: 'utf-8'
      })
    )
    t.equal(
      true,
      pack.name !== 'new-fastify-app',
      'package.json was not just copied from skeleton'
    )
    t.equal(
      true,
      pack.main === 'app/server.js',
      'package.json was correctly enriched with data'
    )

    t.end()
  })
})
