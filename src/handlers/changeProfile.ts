/* eslint-disable no-case-declarations */
import { EventModel } from '@/models/Event'
import { adminState, userState } from '@/middlewares/session'
import {
  editEventKeyboard,
  eventsKeyboard,
  navigationKeyboard,
  oneEventKeyboard,
  phoneKeyboard,
} from '@/helpers/keyboards'
import Context from '@/models/Context'
import formatDate from '@/helpers/formatDate'
import getTitles from '@/helpers/getTitles'
import setCallback from '@/helpers/setCallbackAfisha'
import verifyPhoto from '@/helpers/verifyPhoto'

export default async function changeProfile(ctx: Context) {
  const user = ctx.dbuser
  switch (ctx.match) {
    case 'changePhotoProfile':
      ctx.session.state = userState.sendPhoto
      ctx.session.isRegistred = true
      if (!user.photoId) return await ctx.reply('Отправьте фото')
      await ctx.editMessageMedia({
        type: 'photo',
        media: `${user.photoId}`,
        caption: `Текущее фото\n\n Отправьте новое фото`,
      })
      break
    case 'changeNameProfile':
      ctx.session.state = userState.sendName
      ctx.session.isRegistred = true
      if (!user.photoId) return await ctx.reply('Отправьте новое имя:')
      await ctx.editMessageMedia({
        type: 'photo',
        media: `${user.photoId}`,
        caption: `Введите новое имя:`,
      })
      break
    case 'changePhoneProfile':
      ctx.session.state = userState.sendPhone
      ctx.session.isRegistred = true
      if (!user.photoId)
        return await ctx.reply(
          `Вот старый номер телефона: ${user.phone}\n\nОтправьте новый, нажмите на кнопку ниже`
        )
      await ctx.reply(
        `Вот старый номер телефона: ${user.phone}\n\nОтправьте новый, нажмите на кнопку ниже`,
        {
          reply_markup: {
            keyboard: phoneKeyboard.build(),
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      )

      break
  }
}
