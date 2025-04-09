#!/usr/bin/env node

import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

import { program } from 'commander'
import { readPackageUpSync } from 'read-pkg-up'
import { writePackage } from 'write-pkg'
import fs from 'fs-extra'

import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)
const { version } = require('../package.json')

let root
let skeleton

/**
 * ensure path of new app
 */
const ensurePath = (path) => fs.ensureDir(path)

/**
 * init new yarn project
 */
const initializeYarn = (path) =>
  new Promise((resolve, reject) => {
    const params = ['init', '-y']

    const yarn = spawn('yarn', params, {
      cwd: path,
      stdio: [0, 1, 2]
    })
    yarn.on('close', (code) => {
      if (code === 0) return resolve(code)
      /* c8 ignore next */
      reject(code)
    })
  })

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
  .version(version)
  .arguments('<name>')
  .action(async (name) => {
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
    await ensurePath(root)
    await initializeYarn(root)
    await addPackageConfig(root, skeleton)
    await copySkeleton(root, skeleton)
    await copyEnv(root, skeleton)
  })

/**
 * read args
 */
program.parse(process.argv)
