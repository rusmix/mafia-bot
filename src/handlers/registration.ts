import { phoneKeyboard } from '@/helpers/keyboards'
import verifyPhoto from '@/helpers/verifyPhoto'
import { adminState, userState } from '@/middlewares/session'
import Context from '@/models/Context'
import { UserModel } from '@/models/User'

export default async function registration(ctx: Context) {
  const user = ctx.dbuser
  switch (ctx.session.state) {
    case userState.sendName:
      if (!ctx.message?.text) await ctx.reply('Отправьте имя!')
      user.name = ctx.message.text
      await user.save()
      ctx.session.state = userState.sendPhone

      if (ctx.session.isRegistred) {
        await ctx.reply('Имя сохранёно')
        ctx.session.state = userState.default
      } else
        await ctx.reply('Теперь нажмите на кнопку для отправки телефона👇🏼', {
          reply_markup: {
            keyboard: phoneKeyboard.build(),
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        })

      break
    case userState.sendPhone:
      // eslint-disable-next-line no-case-declarations
      const message = ctx.message
      if (message?.contact) {
        console.log(message.contact.phone_number)
        user.phone = message.contact.phone_number
        ctx.session.state = userState.sendPhoto
        await user.save()
        if (ctx.session.isRegistred) {
          await ctx.reply('Телефон сохранён')
          ctx.session.state = userState.default
        } else await ctx.reply('Осталось отправить фотографию!')
      } else {
        await ctx.reply('Отправьте номер телефона, нажмите на кнопку ниже 👇🏼', {
          reply_markup: {
            keyboard: phoneKeyboard.build(),
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        })
        return
      }
      break
    case userState.sendPhoto:
      // eslint-disable-next-line no-case-declarations
      const photo = verifyPhoto(ctx)
      console.log(photo)
      if (!photo)
        return await ctx.reply('Отправьте фото в виде фото, а не документа')
      user.photoId = photo
      await user.save()
      ctx.session.state = userState.default
      if (ctx.session.isRegistred) {
        ctx.session.state = userState.default
        await ctx.reply('Фото сохранено🔥')
      } else
        await ctx.reply(
          'Всё, регистрация завершена 🔥\nНажми "Афиша", чтобы посмотреть запланированные игры'
        )
      break
  }
}
