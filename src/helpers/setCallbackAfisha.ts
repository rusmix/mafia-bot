import bot from '@/helpers/bot'
import eventButtonHandler from '@/handlers/eventButtonHandler'
import getTitles from './getTitles'

export default async function setCallback() {
  bot.callbackQuery(await getTitles(), eventButtonHandler)
}
