import 'dotenv/config'
import { Bot } from 'grammy'
import { BotContext } from '@/middlewares/session'

const bot = new Bot<BotContext>(process.env.TOKEN)

export default bot
