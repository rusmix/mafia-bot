import setCallback from '@/helpers/setCallbackAfisha'
import { adminState } from '@/middlewares/session'
import Context from '@/models/Context'
import { EventModel } from '@/models/Event'

export default async function addEvent(ctx: Context) {
  let res = undefined
  switch (ctx.session.admin.state) {
    default:
      await ctx.editMessageText('Введите заголовок мероприятия:')
      ctx.session.admin.state = adminState.insertTitle
      break
    case adminState.insertTitle:
      ctx.session.admin.eventTitle = ctx.message.text
      await EventModel.findOrCreate({ title: ctx.session.admin.eventTitle })

      // eslint-disable-next-line no-case-declarations
      const date = new Date()
      await ctx.reply(
        `Теперь введите дату мероприятия в формате: ГГГГ-ММ-ДД-ЧЧ-ММ\nНапример: ${date.getFullYear()}-10-04-20-30`
      )
      ctx.session.admin.state = adminState.insertDate
      break
    case adminState.insertDate:
      // eslint-disable-next-line no-case-declarations
      const text = ctx.message.text
      if (
        !text.match(/20[2-3][1-9]-[0-1][0-9]-[0-3][0-9]-[0-2][0-9]-[0-5][0-9]/)
      )
        return await ctx.reply('Введите корректное значение!')
      // eslint-disable-next-line no-case-declarations
      const formattedDate =
        text.split('-').slice(0, 3).join('-') +
        'T' +
        text.split('-').slice(3, 5).join(':') +
        ':00.000+00:00'

      console.log(formattedDate)

      if (!+new Date(formattedDate))
        return await ctx.reply('Такой даты не существует!')
      console.log('дата норм, идём дальше')
      res = await EventModel.findOne({ title: ctx.session.admin.eventTitle })
      res.date = new Date(Date.parse(formattedDate))
      console.log(res.date)
      await res.save()
      ctx.session.admin.state = adminState.insertDescription
      await ctx.reply(
        'Теперь описание мероприятия (не забудьте включить сюда полный адрес, всю важную информацию, стоимость посещения вводится отдельно):'
      )
      break
    case adminState.insertDescription:
      res = await EventModel.findOne({ title: ctx.session.admin.eventTitle })
      res.description = ctx.message.text
      await res.save()
      ctx.session.admin.state = adminState.insertPhoto
      await ctx.reply('Теперь фотографию:')
      break
    case adminState.insertPhoto:
      console.log(ctx.message)
      // eslint-disable-next-line no-case-declarations
      const doc = ctx.message?.document
        ? ctx.message.document.file_id
        : ctx.message.photo.slice(-1)[0].file_id
      console.log(doc)
      res = await EventModel.findOne({ title: ctx.session.admin.eventTitle })
      res.photoId = doc
      await res.save()
      ctx.session.admin.state = adminState.insertPrice
      await ctx.reply('Теперь стоимость с одного человека:')
      break
    case adminState.insertPrice:
      res = await EventModel.findOne({ title: ctx.session.admin.eventTitle })
      if (isNaN(ctx.message.text as unknown as number))
        return await ctx.reply(
          'Некорректное значение, введите цену без дополнительных знаков'
        )
      res.price = Number(ctx.message.text)
      await res.save()
      ctx.session.admin.state = adminState.insertPlace
      await ctx.reply('Теперь место проведения (площадка, название ресторана):')
      break
    case adminState.insertPlace:
      res = await EventModel.findOne({ title: ctx.session.admin.eventTitle })
      res.place = ctx.message.text
      await res.save()
      ctx.session.admin.state = adminState.insertMaxPlayers
      await ctx.reply('Теперь максимально возможное количество человек:')
      break
    case adminState.insertMaxPlayers:
      if (isNaN(ctx.message.text as unknown as number))
        await ctx.reply('Некорректное значение')
      res = await EventModel.findOne({ title: ctx.session.admin.eventTitle })
      res.maxPlayers = Number(ctx.message.text)
      await res.save()
      ctx.session.admin.state = adminState.default
      console.log(res)
      await ctx.reply('Успешно добавлено')
      void setCallback()
      break
  }
}
