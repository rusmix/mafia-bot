/* eslint-disable import/prefer-default-export */
import getTitles from '@/helpers/getTitles'
import {
  eventsKeyboard,
  navigationKeyboard,
  oneEventAdminKeyboard,
  oneEventKeyboard,
} from '@/helpers/keyboards'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'

export async function oneEventHandler(ctx: Context) {
  const event1 = await EventModel.find({ isActual: true })

  if (event1.length === 1 && (ctx.match === 'left' || ctx.match === 'right'))
    return await ctx.answerCallbackQuery()

  const titles = await getTitles()
  let title = String(ctx.match)

  if (ctx.match != 'left' && ctx.match != 'right' && ctx.match != 'no')
    ctx.session.currentTitle = ctx.match as string

  let index = titles.findIndex((el) => {
    return el === title
  })

  console.log(
    'one event handler admin ____________ current title',
    ctx.session.currentTitle
  )
  if (ctx.match === 'no') {
    title = ctx.session.currentTitle
    index = titles.findIndex((el) => {
      return el === title
    })
  }
  if (ctx.match === 'left' || ctx.match === 'right') {
    title = ctx.session.currentTitle
    console.log(title)
    index = titles.findIndex((el) => {
      return el === title
    })
    console.log(`first index = ${index}`)
    if (ctx.match === 'left' && index === 0) {
      index = titles.length - 1
    } else if (ctx.match === 'left') index = index - 1
    if (ctx.match === 'right' && index === titles.length - 1) {
      index = 0
    } else if (ctx.match === 'right') index = index + 1
    ctx.session.currentTitle = titles[index]
    console.log('keker')
  }

  console.log(`after index = ${index}`)
  const event = await EventModel.findOne({ title: titles[index] })

  // await ctx.editMessageCaption()
  await ctx.editMessageMedia(
    {
      type: 'photo',
      media: `${event.photoId}`,
      caption: ` ${event.title} \n\n${event.date.toLocaleString('ru', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      })}, в ${event.place}\n\n${event.description}`,
    },
    { reply_markup: oneEventAdminKeyboard }
  )
  // await ctx.
}
