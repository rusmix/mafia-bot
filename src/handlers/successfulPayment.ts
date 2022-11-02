import bot from '@/helpers/bot'
import { eventsKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'
import { UserModel } from '@/models/User'

export default async function successfulPayment(ctx: Context) {
  const userId = ctx.update.message.successful_payment.invoice_payload
  const event = await EventModel.findOne({ title: ctx.session.currentTitle })
  console.log(ctx)
  await ctx.api.sendMessage(
    userId,
    `Оплата получена, Вы  успешно записаны на мероприятие ${event.title}`
  )
  const user = await UserModel.findOne({ id: userId })
  event.players.push(user)
  await event.save()
  user.balance = ctx.session.currentBonuses
  ctx.session.currentBonuses = 0
  await user.save()
}
