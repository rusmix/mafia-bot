/* eslint-disable no-case-declarations */
import { EventModel } from '@/models/Event'
import { adminState } from '@/middlewares/session'
import {
  editEventKeyboard,
  eventsKeyboard,
  navigationKeyboard,
  oneEventKeyboard,
} from '@/helpers/keyboards'
import Context from '@/models/Context'
import formatDate from '@/helpers/formatDate'
import getTitles from '@/helpers/getTitles'
import setCallback from '@/helpers/setCallbackAfisha'
import verifyPhoto from '@/helpers/verifyPhoto'

export default async function editEvent(ctx: Context) {
  const event = await EventModel.findOne({ title: ctx.session.currentTitle })
  ctx.session.adminEditing = true
  // await ctx.editMessageCaption()
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
      })}, в ${event.place}\n\n${event.description}`,
    },
    { reply_markup: editEventKeyboard }
  )
  // await ctx.
}

export async function editEventHandler(ctx: Context) {
  const event = await EventModel.findOne({ title: ctx.session.currentTitle })
  switch (ctx.match) {
    case 'changePlace':
      await ctx.editMessageMedia({
        type: 'photo',
        media: `${event.photoId}`,
        caption: ` ${event.title} \n Текущее место ${event.place}\n\n'Введите новое место'`,
      })
      ctx.session.admin.state = adminState.insertPlace
      break
    case 'changeDate':
      await ctx.editMessageMedia({
        type: 'photo',
        media: `${event.photoId}`,
        caption: ` ${event.title}\nТекущая дата ${
          event.date
        }\n\nВведите новую дату мероприятия в формате: ГГГГ-ММ-ДД-ЧЧ-ММ\nНапример: ${new Date().getFullYear()}-10-04-20-30`,
      })
      ctx.session.admin.state = adminState.insertDate
      break
    case 'changeDescription':
      await ctx.editMessageMedia({
        type: 'photo',
        media: `${event.photoId}`,
        caption: ` ${event.title} \n\nВот старое описание:\n\n${event.description}\n\nВведите новое описание`,
      })
      ctx.session.admin.state = adminState.insertDescription
      break
    case 'changePhoto':
      await ctx.editMessageMedia({
        type: 'photo',
        media: `${event.photoId}`,
        caption: ` ${event.title} \n\nОтправьте новое фото`,
      })
      ctx.session.admin.state = adminState.insertPhoto
      break
    case 'changeTitle':
      await ctx.editMessageMedia({
        type: 'photo',
        media: `${event.photoId}`,
        caption: ` ${event.title} \n\nОтправьте новый заголовок`,
      })
      ctx.session.admin.state = adminState.insertTitle
      break
  }
}

export enum adminState123 {
  insertDate = 'insertDate',
  insertTitle = 'insertTitle',
  insertDescription = 'insertDescription',
  insertPhoto = 'insertPhoto',
  insertMaxPlayers = 'insertMaxPlayers',
  insertPlace = 'insertPlace',
  insertPrice = 'insertPrice',
  default = 'default',
}

export async function editEventMessageHandler(ctx: Context) {
  const res = await EventModel.findOne({ title: ctx.session.currentTitle })
  switch (ctx.session.admin.state) {
    default:
      break
    case adminState.insertTitle:
      if (!ctx.message?.text)
        return await ctx.reply('Ожидается текстовый заголовок')
      res.title = ctx.message.text
      console.log(res.date)
      await res.save()
      await ctx.reply('успешно сохранено')
      ctx.session.currentTitle = ctx.message.text
      ctx.session.admin.state = adminState.default
      void setCallback()
      break
    case adminState.insertDate:
      const text = ctx.message.text
      if (
        !text.match(/20[2-3][1-9]-[0-1][0-9]-[0-3][0-9]-[0-2][0-9]-[0-5][0-9]/)
      )
        return await ctx.reply('Введите корректное значение!')
      const formattedDate = formatDate(text)

      console.log(formattedDate)

      if (!formattedDate) return await ctx.reply('Такой даты не существует!')
      console.log('дата норм, идём дальше')
      res.date = formattedDate
      console.log(res.date)
      await res.save()
      await ctx.reply('Дата сохранена')
      ctx.session.admin.state = adminState.default
      break
    case adminState.insertDescription:
      if (!ctx.message?.text)
        return await ctx.reply('Ожидается текстовое описание')
      res.description = ctx.message.text
      await res.save()
      await ctx.reply('Описание сохранено')
      ctx.session.admin.state = adminState.default
      break
    case adminState.insertPhoto:
      const photoId = verifyPhoto(ctx)
      if (photoId === '0') return ctx.reply('Ожидается фото, а не документ')
      res.photoId = photoId
      await res.save()
      await ctx.reply('Фото сохранено')
      ctx.session.admin.state = adminState.default
      break
    case adminState.insertPrice:
      if (isNaN(ctx.message.text as unknown as number))
        return await ctx.reply(
          'Некорректное значение, введите цену без дополнительных знаков'
        )
      res.price = Number(ctx.message.text)
      await res.save()
      await ctx.reply('Схранено')
      ctx.session.admin.state = adminState.default
      break
    case adminState.insertPlace:
      res.place = ctx.message.text
      await res.save()
      await ctx.reply('Новое место сохранено')
      ctx.session.admin.state = adminState.default
      break
    case adminState.insertMaxPlayers:
      if (isNaN(ctx.message.text as unknown as number))
        await ctx.reply('Некорректное значение')
      ctx.session.admin.state = adminState.default
      break
  }
  ctx.session.adminEditing = false
  console.log('ctx.session.adminEditing: ', ctx.session.adminEditing)
}
