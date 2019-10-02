#!/usr/bin/env node

const cli = require('commander')

let nameValue
let optValue

cli
  .version('0.1.0')
  .arguments('<name> [opt]')
  .action(function(name, opt) {
    nameValue = name
    optValue = opt
  })

cli.parse(process.argv)

if (typeof nameValue === 'undefined') {
  console.error('please specify your new apps name...')
  process.exit(1)
}
console.log('name:', nameValue)
console.log('opt:', optValue)
