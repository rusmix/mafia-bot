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
import { UserModel } from '@/models/User'

export async function writeOffBonuses(ctx: Context) {
  if (ctx.dbuser.isAdmin) {
    const phone = ctx.message.text.split(' ')[1]
    const amount = ctx.message.text.split(' ')[2]

    const user = await UserModel.findOne({ phone: phone })
    if (!user)
      return await ctx.reply(
        'Пользователь не найден, попробуйте проверить телефон. Он должен быть в формате +79991233213'
      )
    if (isNaN(Number(amount)))
      return await ctx.reply('Неправильно введёно количество бонусов')
    if (user.balance < Number(amount))
      return await ctx.reply('Недостаточно бонусов на балансе')
    user.balance -= Number(amount)
    await user.save()
    await ctx.reply(`Бонусы списаны успешно! Остаток на счёте: ${user.balance}`)
  }
}
