import { eventsKeyboard, numbersKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'

export default async function registerToEvent(ctx: Context) {
  const event = await EventModel.findOne({ title: ctx.session.currentTitle })
  const amount = event.amountOfPlayers
  const maxAmount = event.maxPlayers
  await ctx.editMessageMedia(
    {
      type: 'photo',
      media: `${event.photoId}`,
      caption: `Доступное количество мест на "${event.title}": ${
        maxAmount - amount
      }.\nУкажите, будете ли вы приглашать друзей, если да, то сколько?`,
    },
    { reply_markup: numbersKeyboard(maxAmount - amount) }
  )
  // await ctx.
}
