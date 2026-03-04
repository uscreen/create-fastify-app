import { exec } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const cwd = path.resolve(__dirname, './_arena/')

export const cli = (args) => {
  return new Promise((resolve) => {
    exec(
      `node ${path.resolve(__dirname, '../bin/cli.js')} ${args.join(' ')}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr
        })
      }
    )
  })
}

export const before = () => {
  fs.ensureDirSync(cwd)
}

export const after = () => {
  fs.removeSync(cwd)
}
