import { DocumentType } from '@typegoose/typegoose'
import { Event, EventModel } from '@/models/Event'
import { InlineKeyboard, Keyboard } from 'grammy'

export const phoneKeyboard = new Keyboard().requestContact(
  'Отправить номер телефона'
)

export const navigationKeyboard = new InlineKeyboard()
  .text('◀️', 'left')
  .text('▶️', 'right')

export const navigationKeyboardRight = new InlineKeyboard().text('▶️', 'right')

export const navigationKeyboardLeft = new InlineKeyboard().text('◀️', 'left')

export const adminKeyboard = new InlineKeyboard().text(
  'Добавить ивент',
  'addEvent'
)

export const numbers = ['1', '2', '3', '4', '5', '6']

export const numbersKeyboard = new InlineKeyboard()
  .text('Я один', '1')
  .text('+ 1', '2')
  .text('+ 2', '3')
  .row()
  .text('+ 3', '4')
  .text('+ 4', '5')
  .text('+ 5', '6')

export const eventsKeyboard = async () => {
  let res = await EventModel.find({ isActual: true }) // title date (day of week) place

  console.log(
    res,
    '\n_________________________________\n_________________________________\n'
  )

  await Promise.all(
    res.map(async (el) => {
      if (+new Date() - +new Date(el.date) > 0) {
        el.isActual = false
        await el.save()
      }
    })
  )

  res = await EventModel.find({ isActual: true })
  console.log(res)
  let keyboard = new InlineKeyboard()

  res.sort(function (a, b) {
    return +new Date(a.date) - +new Date(b.date)
  })

  res.map((el) => {
    keyboard = keyboard
      .text(
        `${el.title} в ${el.date.toLocaleString('ru', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
        })}, в ${el.place}`,
        `${el.title}`
      )
      .row()
  })
  return keyboard
}

export const oneEventKeyboard = (event: DocumentType<Event>) => {
  const amount = event.players.length
  const maxAmount = event.maxPlayers
  const keyboard = new InlineKeyboard()
    .text('◀️', 'left')
    .text('▶️', 'right')
    .row()
    .text(`Игроки (${amount}/${maxAmount})`, 'showPlayers')
    .row()
    .text(`Записаться`, 'register')
  return keyboard
}

export const webAppKeyboard = {
  inline_keyboard: [
    [
      {
        text: 'Оферта',
        web_app: { url: '' },
        resize: true,
      },
    ],
  ],
}
