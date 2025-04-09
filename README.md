# create-fastify-app

[![Test CI](https://github.com/uscreen/create-fastify-app/actions/workflows/main.yml/badge.svg)](https://github.com/uscreen/create-fastify-app/actions/workflows/main.yml)
[![Test Coverage](https://coveralls.io/repos/github/uscreen/create-fastify-app/badge.svg?branch=main)](https://coveralls.io/github/uscreen/create-fastify-app?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/uscreen/create-fastify-app/badge.svg?targetFile=package.json)](https://snyk.io/test/github/uscreen/create-fastify-app?targetFile=package.json)
[![NPM Version](https://badge.fury.io/js/@uscreen.de%2Fcreate-fastify-app.svg)](https://badge.fury.io/js/@uscreen.de%2Fcreate-fastify-app)

> cli to quickly bootstrap a new fastify-app

This package provides the cli skript to create a new `@uscreen.de/fastify-app` from scratch inside of a monorepo. No need to install any other prerequisites than node and pnpm. Features include:

* initialize new package.json
* setup __application skeleton__
* setup __dotfiles__
* setup __.env__ for starting

## Usage

Use `pnpm create` to create a new fastify-app, like so:

```bash
$ pnpm create @uscreen.de/fastify-app new-app
```

It will create a directory called `new-app` inside the current folder.
Inside that directory, it will generate the initial project structure:

```bash
new-app
├── .env
├── .env.example
├── .gitignore
├── README.md
├── app
│   ├── app.js
│   ├── config.js
│   ├── plugins
│   │   └── noop.js
│   ├── schemas.js
│   ├── server.js
│   └── services
│       └── noop.js
├── package.json
└── test
    ├── app
    │   └── noop.test.js
    └── helper.js
```

`pnpm create` will update itself and checkout the latest version of the boilerplate packed with lot's of best-practice settings and prepared for local dev.

More Details can be found in `@uscreen.de/fastify-app` [README](https://www.npmjs.com/package/@uscreen.de/fastify-app)

After creation has finished cd into the new apps directory and check it's README for options. In general you should be able to start your new app in dev mode, like so:

```bash
$ cd ./new-app
$ pnpm install
$ pnpm dev
```

---

## Roadmap

- add tests
- add more skeletons
- add options to choose from
- > ...TBD

## Changelog

### 2.0.0

#### Changed

- changed skeleton & creation process so it's suitable for use in a monorepo
- upgraded skeleton to fastify@5
- use pnpm instead of yarn

#### Removed

- `-y` option (it is default now)

### 1.1.2

#### Changed

- upgraded to node 20.x (LTS)

### 1.1.1

#### Changed

- upgraded to node 18.x (LTS)

### 1.1.0

#### Changed

- migrated yorkie to husky
- cleanup app.js and server.js

#### Added

- uses @uscreen.de/common-esm for esm migration
- uses @uscreen.de/fastify-app options for app creation
- uses nodemon for dev mode

#### Removed

- dropped pm2 package and config

### 1.0.0

#### Changed

- switch skeleton to __ESM only__
- upgrade skeleton to fastify@4.x

### v0.7.0

- added: graceful shutdown in skeleton

### v0.6.0

- changed: use versions specified in skeleton's package.json

### v0.5.0

- moved to esm
- upgraded to node 16.x (LTS)

### v0.4.0

- upgraded to node 14.x (LTS)

### v0.3.0

- upgraded to fastify 3.x
- upgraded to node 12.x (LTS)

### v0.2.0

- added instructions

### v0.1.0

- initially bootstrapped
- added basic skeleton app based on fastify-app

---

## License

Licensed under [MIT](./LICENSE).

Published, Supported and Sponsored by [u|screen](https://uscreen.de)
