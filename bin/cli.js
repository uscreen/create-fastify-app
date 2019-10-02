#!/usr/bin/env node

const path = require('path')
const cli = require('commander')
const readPkgUp = require('read-pkg-up')
const writePackage = require('write-pkg')
const fs = require('fs-extra')

const { spawn } = require('child_process')

let root

/**
 * init new git
 */
const initializeGitRepository = path =>
  new Promise((resolve, reject) => {
    const git = spawn('git', ['init', path])
    git.stdout.on('data', data => process.stdout.write(data))
    git.stderr.on('data', data => process.stderr.write(data))
    git.on('close', code => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })

/**
 * init new yarn project
 */
const initializeYarn = path =>
  new Promise((resolve, reject) => {
    const yarn = spawn('yarn', ['init'], {
      cwd: path,
      stdio: [0, 1, 2]
    })
    yarn.on('close', code => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })

/**
 * install extra dev packages for linting
 */
const installPackages = path =>
  new Promise((resolve, reject) => {
    const yarn = spawn(
      'yarn',
      [
        'add',
        'eslint',
        'eslint-config-prettier',
        'eslint-config-standard',
        'eslint-plugin-import',
        'eslint-plugin-node',
        'eslint-plugin-prettier',
        'eslint-plugin-promise',
        'eslint-plugin-standard',
        'lint-staged',
        'tap',
        'prettier',
        'yorkie',
        '-D'
      ],
      {
        cwd: path
      }
    )
    yarn.stdout.on('data', data => process.stdout.write(data))
    yarn.stderr.on('data', data => process.stderr.write(data))
    yarn.on('close', code => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })

/**
 * configure package.json to use linting, testing, stuff
 */
const addPackageConfig = path => {
  const pack = readPkgUp.sync({ cwd: path })
  delete pack.packageJson._id
  delete pack.packageJson.readme
  pack.packageJson.scripts = Object.assign(pack.packageJson.scripts || {}, {
    start: 'pm2 start pm2-dev.config.js',
    stop: 'pm2 delete pm2-dev.config.js',
    logs: `pm2 logs ${pack.packageJson.name} --raw | pino-pretty -t`,
    lint: "eslint '**/*.js' --fix",
    test: 'tap test/**/*.test.js',
    'test:cov': 'tap --coverage-report=html test/**/*.test.js',
    'test:ci': 'tap --coverage-report=text-summary test/**/*.test.js',
    deploy: 'pm2 deploy pm2.config.js',
    postdeploy: 'pm2 reload pm2.config.js'
  })
  pack.packageJson.gitHooks = {
    'pre-commit': 'lint-staged'
  }
  pack.packageJson['lint-staged'] = {
    '*.{js}': ['eslint --fix', 'git add']
  }
  return writePackage(pack.path, pack.packageJson)
}

/**
 * copy app skeleton to destination
 */
const copySkeleton = path => {
  const src = path.join(__dirname, '..', 'skeleton')
  return fs.copy(src, path, { overwrite: false })
}

/**
 * define the command
 */
cli
  .version('0.1.0')
  .arguments('<name> [opt]')
  .action(async (name, opt) => {
    if (typeof name === 'undefined') {
      console.error('please specify your new apps name...')
      process.exit(1)
    }

    /**
     * the root directory of new project
     */
    root = path.resolve(process.cwd(), name)

    /**
     * setup new app
     */
    await initializeGitRepository(root)
    await initializeYarn(root)
    await installPackages(root)
    await addPackageConfig(root)
    await copySkeleton(root)
  })

/**
 * read args
 */
cli.parse(process.argv)

/**
 * output help as default
 */
if (!process.argv.slice(2).length) {
  cli.help()
}
