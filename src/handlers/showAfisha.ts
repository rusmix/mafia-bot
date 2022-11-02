import { eventsKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'

export default async function showAfisha(ctx: Context) {
  // await ctx.reply('Доступные для записи мероприятия!', {
  //   reply_markup: await eventsKeyboard(),
  // })
  await ctx.replyWithPhoto(
    'AgACAgIAAxkBAAISMmNgRNqRDhx8mM40sDVAPRV8zAN4AAIdwTEbwWMBS4eDxO1p5mPRAQADAgADeAADKgQ',
    {
      caption: 'Доступные для записи мероприятия!',
      reply_markup: await eventsKeyboard(),
    }
  )
}
