import bot from '@/helpers/bot'
import { eventsKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'
import { UserModel } from '@/models/User'

export default async function successfulPayment(ctx: Context) {
  // const userId = ctx.session.userId
  // const user = await UserModel.findOne({ id: userId })
  // event.players.push({ user, guests: ctx.session.currentAmountOfPeople - 1 })
  // event.amountOfPlayers += ctx.session.currentAmountOfPeople
  // await event.save()
  // user.balance = ctx.session.currentBonuses
  // ctx.session.currentBonuses = 0
  // ctx.session.currentAmountOfPeople = 0
  // delete ctx.session.currentTitle
  // user.thisMonthStats.gamesTotal += 1
  // await user.save()
}
