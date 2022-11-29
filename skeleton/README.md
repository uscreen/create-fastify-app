# ${app-name}

> __TODO:__
> add a name & short description of this apps purpose

## Usage

* `make start`: start app on local dev
* `make test`: test app

## Configure

Configuration is read by dotenv from `app/.env` file and validated _[optional modified]_ by `app/config.js`. Please add extra defaults if needed to `config.js`. Default values should __always__ refer to local dev setups.

> __Note:__
> the `.env` file should __never__ get pushed to repository. So adding secrets and credentials to `.env` can be considered a secure option bound to specific environments.

## Api

After starting your server you will find swagger documenation at [http://127.0.0.1:3000/api/docs/](http://127.0.0.1:3000/api/docs/) to explore web api requests interactively.

---

## Roadmap

> TBD

## Changelog

### v0.0.0

- initially bootstrapped by `yarn create @uscreen.de/fastify-app`

---

## Credits

application [boilerplate](https://www.npmjs.com/package/@uscreen.de/fastify-app) provided by [u|screen](https://uscreen.de)
