# create-fastify-app

> cli to quickly bootstrap a new fastify-app

This package provides the cli skript to create a new `@uscreen.de/fastify-app` from scratch. No need to install any other prerequisits than node and yarn. Features include:

* initialize new __git__ repository
* initialize new __yarn__ package.json
* install all __dependencies__ and __devDependencies__
* add __skripts__ and __hooks__ to package.json
* setup __application skeleton__
* setup __dotfiles__ and __linting__
* setup __.env__ for starting

## Usage

Use `yarn create` to create a new fastify-app, like so:

```bash
$ yarn create @uscreen.de/fastify-app new-app
```

and follow instructions. It will create a directory called `new-app` inside the current folder.
Inside that directory, it will generate the initial project structure and install any dependencies:

```bash
new-app
├── Makefile
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
├── pm2-dev.config.js
├── pm2.config.js
├── test
│   ├── helper.js
│   └── noop.test.js
└── yarn.lock
```

`yarn create` will update itself and checkout the latest version of the boilerplate packed with lot's of best-practice settings and prepared for local dev and pm2 deployment.

More Details can be found in `@uscreen.de/fastify-app` [README](https://www.npmjs.com/package/@uscreen.de/fastify-app)

After creation has finished cd into the new apps directory and check it's README for options. In General you should be able to start your new app in dev mode, like so:

```bash
$ cd ./new-app
$ make start
$ make logs
```

---

## Roadmap

- add tests
- add more skeletons
- add options to choose from
- > ...TBD

## Changelog

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
