#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import { program } from 'commander'
import { readPackageUpSync } from 'read-pkg-up'
import { writePackage } from 'write-pkg'
import fs from 'fs-extra'

import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let root
let skeleton

/**
 * init new git
 */
const initializeGitRepository = (path) =>
  new Promise((resolve, reject) => {
    const git = spawn('git', ['init', path])
    git.stdout.on('data', (data) => process.stdout.write(data))
    git.stderr.on('data', (data) => process.stderr.write(data))
    git.on('close', (code) => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })

/**
 * init new yarn project
 */
const initializeYarn = (path) =>
  new Promise((resolve, reject) => {
    const yarn = spawn('yarn', ['init'], {
      cwd: path,
      stdio: [0, 1, 2]
    })
    yarn.on('close', (code) => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })

/**
 * install extra dev packages from skeleleton
 */
const installDevPackages = (appPath, skelPath) => {
  const skelPack = readPackageUpSync({ cwd: skelPath })
  const devDependencies = Object.keys(skelPack.packageJson.devDependencies)
  return new Promise((resolve, reject) => {
    const yarn = spawn('yarn', ['add', ...devDependencies, '-D'], {
      cwd: appPath
    })
    yarn.stdout.on('data', (data) => process.stdout.write(data))
    yarn.stderr.on('data', (data) => process.stderr.write(data))
    yarn.on('close', (code) => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })
}

/**
 * install extra prod packages from skeleleton
 */
const installPackages = (appPath, skelPath) => {
  const skelPack = readPackageUpSync({ cwd: skelPath })
  const dependencies = Object.keys(skelPack.packageJson.dependencies)
  return new Promise((resolve, reject) => {
    const yarn = spawn('yarn', ['add', ...dependencies], {
      cwd: appPath
    })
    yarn.stdout.on('data', (data) => process.stdout.write(data))
    yarn.stderr.on('data', (data) => process.stderr.write(data))
    yarn.on('close', (code) => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })
}

/**
 * configure package.json to use linting, testing, stuff
 */
const addPackageConfig = (path, skelPath) => {
  const skelPack = readPackageUpSync({ cwd: skelPath })
  const pack = readPackageUpSync({ cwd: path })
  delete pack.packageJson._id
  delete pack.packageJson.readme

  pack.packageJson.main = skelPack.packageJson.main

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
const copySkeleton = (appPath, skelPath) => {
  return fs.copy(skelPath, appPath, { overwrite: false })
}

/**
 * copy example env
 */
const copyEnv = (appPath, skelPath) => {
  return fs.copy(
    path.resolve(skelPath, '.env.example'),
    path.join(appPath, '.env'),
    {
      overwrite: false
    }
  )
}

/**
 * define the command
 */
program
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
     * the root directory of chosen skeleton
     */
    skeleton = path.join(__dirname, '..', 'skeleton')

    /**
     * setup new app
     */
    await initializeGitRepository(root)
    await initializeYarn(root)
    await installDevPackages(root, skeleton)
    await installPackages(root, skeleton)
    await addPackageConfig(root, skeleton)
    await copySkeleton(root, skeleton)
    await copyEnv(root, skeleton)
  })

/**
 * read args
 */
program.parse(process.argv)

/**
 * output help as default
 */
if (!process.argv.slice(2).length) {
  program.help()
}
