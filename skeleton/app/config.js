import envSchema from 'env-schema'
import CommonESM from '@uscreen.de/common-esm'

const { join } = new CommonESM(import.meta.url)

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

config.autoloads = [join('plugins'), join('services')]

config.swagger = {
  routePrefix: `${config.prefix}/docs`,
  exposeRoute: true,
  addModels: true
}

config.health = {
  exposeStatusRoute: `${config.prefix}/health`
}

export default config
