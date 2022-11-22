const { name, main } = require('./package.json')

module.exports = {
  apps: [
    {
      name,
      script: main,
      merge_logs: true,
      watch: ['app'],
      ignore_watch: ['.git', 'app/*.pid'],
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
}
