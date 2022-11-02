# Telegram bot starter based on [grammY](https://grammy.dev)

Please, enjoy this starter template for Telegram bots based on [grammY](https://grammy.dev). It includes most common middlewares, MongoDB integration, language picker and internationalization and shows basic encapsulation techniques used by me.

# Installation and local launch

1. Clone this repo
2. Launch the [mongo database](https://www.mongodb.com/) locally
3. Create `.env` with the environment variables listed below
4. Run `yarn` in the root folder

- Download pm2: sudo npm install pm2 -g
- to start: pm2 start "yarn distribute"
- restart: pm2 restart (process_id) --update-env

# Environment variables

- `TOKEN` — Telegram bot token
- `MONGO` — URL of the mongo database
- `PROVIDER_TOKEN` - pay system
- `PAYMENTMODELID' - для статистики id модельки Also, please, consider looking at `.env.sample`.

# License

MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!
