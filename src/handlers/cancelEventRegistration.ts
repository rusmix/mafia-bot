import {
  eventsKeyboard,
  numbersKeyboard,
  oneEventKeyboard,
} from '@/helpers/keyboards'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'

export default async function cancelEventRegistration(ctx: Context) {
  const event = await EventModel.findOne({ title: ctx.session.currentTitle })
  const user = ctx.dbuser

  user.balance -= user.currentBonuses
  user.currentBonuses = 0
  await user.save()

  const player = event.players.find((el) => {
    return el.user.id === ctx.dbuser.id
  })

  const index = event.players.findIndex((el) => {
    return el.user.id === ctx.dbuser.id
  })

  event.amountOfPlayers -= player.guests + 1
  event.players.splice(index, 1)
  await event.save()

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
      })}, в ${event.place}\n\n${event.description}\n\nБронь снята`,
    },
    { reply_markup: oneEventKeyboard(event, ctx) }
  )
  // await ctx.
}
