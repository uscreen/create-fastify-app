'use strict'

const path = require('path')
const envSchema = require('env-schema')

const schema = {
  type: 'object',
  properties: {
    httpPort: {
      default: 3000
    },
    httpBind: {
      default: '127.0.0.1'
    },
    prefix: {
      default: '/api'
    },
    logEnabled: {
      default: true
    },
    logLevel: {
      default: 'info'
    }
  }
}

const config = envSchema({
  schema: schema,
  dotenv: true
})

config.autoloads = [
  path.join(__dirname, 'plugins'),
  path.join(__dirname, 'services')
]

config.swagger = {
  routePrefix: `${config.prefix}/docs`,
  exposeRoute: true,
  addModels: true
}

config.health = {
  exposeStatusRoute: `${config.prefix}/health`
}

module.exports = config
