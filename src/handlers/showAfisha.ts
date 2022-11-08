import { EventModel } from '@/models/Event'
import { eventsKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'
import testEvent from '@/models/Event'

export default async function showAfisha(ctx: Context) {
  // await ctx.reply('Доступные для записи мероприятия!', {
  //   reply_markup: await eventsKeyboard(),
  // })
  // const events = (await EventModel.find({ isActual: true })).filter(
  //   (potentialEvent) =>
  //     Object.keys(testEvent).some((key) => potentialEvent[key] !== undefined)
  // )
  const events = await EventModel.getActualEvents()
  // await Promise.all(
  //   events.map(async (el) => {
  //     if (+new Date() - +new Date(el.date) > 2 * 24 * 60 * 60 * 1000) {
  //       el.isActual = false
  //       await el.save()
  //     }
  //   })
  // )
  // events = await EventModel.getActualEvents()

  // console.log(events)
  if (events.length === 0)
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
