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
  routePrefix: '/api/docs',
  exposeRoute: true,
  addModels: true
}

config.healthCheck = {
  exposeStatusRoute: '/api/health'
}

module.exports = config
