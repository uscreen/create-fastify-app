import fs from 'fs-extra'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'

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

export const teardown = () => {
  fs.removeSync(cwd)
}
