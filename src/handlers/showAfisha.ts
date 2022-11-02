import { eventsKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'

export default async function showAfisha(ctx: Context) {
  // await ctx.reply('Доступные для записи мероприятия!', {
  //   reply_markup: await eventsKeyboard(),
  // })
  const events = await EventModel.find({ isActual: true })
  if (!events)
    return await ctx.reply('На данный момент никаких событий не запланировано!')

  events.sort(function (a, b) {
    return +new Date(a.date) - +new Date(b.date)
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await ctx.replyWithPhoto(events[0].photoId, {
    caption: 'Доступные для записи мероприятия!',
    reply_markup: await eventsKeyboard(),
  })
}
