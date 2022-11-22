import getTitles from '@/helpers/getTitles'
import {
  editEventKeyboard,
  eventsKeyboard,
  navigationKeyboard,
  oneEventKeyboard,
  yesOrNoKeyboard,
} from '@/helpers/keyboards'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'
import { oneEventHandler } from './OneEventHandler'

export default async function editEvent(ctx: Context) {
  const event = await EventModel.findOne({
    title: ctx.session.currentTitle,
    isActual: true,
  })

  if (!event) return await ctx.reply('Событие уже удалено.')

  if (ctx.match === 'yes') {
    event.isActual = false
    await event.save()
    return await ctx.editMessageMedia({
      type: 'photo',
      media: `${event.photoId}`,
      caption: `Успешно удалено: ${event.title}`,
    })
  }
  if (ctx.match === 'no') {
    return await oneEventHandler(ctx)
  }
  // await ctx.editMessageCaption()

  await ctx.editMessageMedia(
    {
      type: 'photo',
      media: `${event.photoId}`,
      caption: `Вы точно хотите удалить ${event.title}?`,
    },
    { reply_markup: yesOrNoKeyboard }
  )
  // await ctx.
}
