import { UserModel } from '@/models/User'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'

export default async function sendBill(ctx: Context) {
  const event = await EventModel.findOne({ title: ctx.session.currentTitle })
  const amountOfPeople = Number(ctx.match)

  const price = amountOfPeople * event.price

  const totalPrice = price - ctx.dbuser.balance

  await ctx.editMessageMedia({
    type: 'photo',
    media: `${event.photoId}`,
    caption: `Стоимость с одного человека: ${
      event.price
    } руб. С учётом бонусов на Вашем балансе к оплате ${totalPrice} руб.\n\nВам начислится кэшбек в размере ${Math.floor(
      totalPrice * 0.1
    )} руб.`,
  })

  ctx.session.currentBonuses = Math.floor(totalPrice * 0.1)

  await ctx.api.sendInvoice(
    ctx.from.id as number,
    'Оплата',
    'Регистрация на игру Мафия',

    `${ctx.from.id}`,

    process.env.PROVIDER_TOKEN,
    'RUB',
    [{ label: 'Оплата', amount: totalPrice * 100 }]
  )
}
