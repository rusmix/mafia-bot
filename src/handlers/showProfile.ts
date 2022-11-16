import {
  editProfileKeyboard,
  eventsKeyboard,
  numbersKeyboard,
} from '@/helpers/keyboards'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'

export default async function registerToEvent(ctx: Context) {
  const user = ctx.dbuser
  console.log(user)
  if (!user.photoId)
    return await ctx.reply(
      `Профиль\n\nИмя: ${user.name}\nТелефон: ${user.phone}\nКоличество бонусных баллов: ${user.balance}\n\nСтатистика: ${user.thisMonthStats.gamesTotal} игр сыграно.`,
      { reply_markup: editProfileKeyboard }
    )
  await ctx.replyWithPhoto(`${user.photoId}`, {
    caption: `Профиль\n\nИмя: ${user.name}\nТелефон: ${user.phone}\nКоличество бонусных баллов: ${user.balance}\n\nСтатистика: ${user.thisMonthStats.gamesTotal} игр сыграно.`,
    reply_markup: editProfileKeyboard,
  })
}
