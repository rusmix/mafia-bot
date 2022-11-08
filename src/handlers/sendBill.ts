import { UserModel } from '@/models/User'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'
import { payKeyboard } from '@/helpers/keyboards'
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk')

export default async function sendBill(ctx: Context) {
  const event = await EventModel.findOne({ title: ctx.session.currentTitle })
  const amountOfPeople = Number(ctx.match)
  ctx.session.currentAmountOfPeople = amountOfPeople

  const price = amountOfPeople * event.price

  const totalPrice = price

  await ctx.editMessageMedia({
    type: 'photo',
    media: `${event.photoId}`,
    caption: `Стоимость с одного человека: ${
      event.price
    } руб. \nК оплате ${totalPrice} руб.\n\nВам начислятся бонусы в размере ${Math.floor(
      totalPrice * 0.1
    )} руб.`,
  })

  ctx.session.currentBonuses = Math.floor(totalPrice * 0.1)

  const qiwiApi = new QiwiBillPaymentsAPI(process.env.SECRET_KEY)

  const billId = `${event.price}-${amountOfPeople}-${
    ctx.session.userId
  }-${new Date().getHours()}:${new Date().getMinutes()}`

  const lifetime = qiwiApi.getLifetimeByDay(31)
  ctx.session.billId = billId

  console.log(billId)

  const fields = {
    amount: totalPrice, // amount * ctx.session.price * price(ctx.session.currency),  // ______________ ИСПРАВИТЬ
    currency: 'RUB',
    comment: `${event.title}-${ctx.dbuser.usernameTg}-${ctx.dbuser.id}`,
    expirationDateTime: lifetime,
  }

  qiwiApi.createBill(billId, fields).then(async (data) => {
    console.log(data)
    return await ctx.reply(
      'Места забронированы! При оплате через бота, Вам начисляются бонусные баллы! Оплата зачислится в течение 15 минут.',
      {
        reply_markup: payKeyboard(data.payUrl as string),
      }
    )
  })
  //БРОНЬ
  const userId = ctx.session.userId
  const user = await UserModel.findOne({ id: userId })
  event.players.push({ user, guests: ctx.session.currentAmountOfPeople - 1 })
  event.amountOfPlayers += ctx.session.currentAmountOfPeople
  await event.save()

  const startTime = +Date.now()

  const checkBill = setInterval(
    function getBillInfo(billId: string) {
      qiwiApi.getBillInfo(billId).then(async (data) => {
        console.log(data)
        if (data.status.value === 'PAID') {
          clearInterval(checkBill)
          await ctx.reply(
            `Успешно оплачено, баллы начислены! Ждём Вас в ${event.place}!`
          )
          user.balance += ctx.session.currentBonuses
          user.currentBonuses = ctx.session.currentBonuses
          ctx.session.currentBonuses = 0
          ctx.session.currentAmountOfPeople = 0
          delete ctx.session.currentTitle
          user.thisMonthStats.gamesTotal += 1
          await user.save()
          delete ctx.session.billId
        }
        if (+new Date() - +new Date(event.date) > 2 * 24 * 60 * 60 * 1000) {
          clearInterval(checkBill)
          //   await ctx.reply(
          //     'Вы не успели оплатить счёт! Попробуйте забронировать ещё раз.'
          //   )
          //   qiwiApi.cancelBill(billId).then((data) => {
          //     //do with data
          //   })

          //   event.players = event.players.filter((el) => el.user != user)
          //   event.amountOfPlayers -= ctx.session.currentAmountOfPeople
          //   await event.save()

          //   ctx.session.currentBonuses = 0
          //   ctx.session.currentAmountOfPeople = 0
          //   delete ctx.session.currentTitle
          //   delete ctx.session.billId
        }
      })
    },
    13 * 60 * 1000,
    billId
  )
}
