import path from 'path'
import envSchema from 'env-schema'
import { dirname } from './modules/common-esm.js'

const __dirname = dirname(import.meta.url)

const schema = {
  type: 'object',
  properties: {
    httpPort: { default: 3000 },
    httpBind: { default: '127.0.0.1' },
    prefix: { default: '/api' },
    logEnabled: { default: true },
    logLevel: { default: 'info' }
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

export default config
