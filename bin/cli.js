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
const initializeYarn = (path, { yes } = {}) =>
  new Promise((resolve, reject) => {
    const params = ['init']
    if (yes) params.push('-y')

    const yarn = spawn('yarn', params, {
      cwd: path,
      stdio: [0, 1, 2]
    })
    yarn.on('close', (code) => {
      if (code === 0) return resolve(code)
      reject(code)
    })
  })

/**
 * install packages
 */
const installPackages = (appPath) => {
  return new Promise((resolve, reject) => {
    const yarn = spawn('yarn', ['install'], {
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
  pack.packageJson.type = skelPack.packageJson.type
  pack.packageJson.scripts = skelPack.packageJson.scripts
  pack.packageJson['lint-staged'] = skelPack.packageJson['lint-staged']

  pack.packageJson.dependencies = skelPack.packageJson.dependencies
  pack.packageJson.devDependencies = skelPack.packageJson.devDependencies

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
  .arguments('<name>')
  .option('-y --yes')
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
    await initializeYarn(root, opt)
    await addPackageConfig(root, skeleton)
    await installPackages(root)
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
