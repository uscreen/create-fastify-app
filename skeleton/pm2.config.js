const { name, main, repository } = require('./package.json')

module.exports = {
  apps: [
    {
      name,
      script: main,
      merge_logs: true,
      ignore_watch: ['.git', 'app/*.pid'],
      env: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    stage: {
      user: 'user',
      host: 'server-stage.example.com',
      ref: 'origin/master',
      repo: repository,
      path: `/home/user/${name}`,
      'pre-setup': 'yarn add pm2 pino-pretty;',
      'post-setup':
        'cp ./.env.example ../shared/.env; ln -s ../shared/.env ./.env',
      'post-deploy': 'yarn install --production; yarn postdeploy'
    }
  }
}
