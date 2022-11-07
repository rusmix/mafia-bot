/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { User, UserModel } from '@/models/User'

export default async function notifyAllUsers(ctx: Context) {
  const users = await UserModel.find({ isActive: true })

  //   if (!users) {
  //     const users1 = await UserModel.updateMany(
  //       {
  //         isSentNewEvent: true,
  //         isActive: true,
  //       },
  //       { isSentNewEvent: false }
  //     )
  //     return
  //   }

  for (let i = 0; i < users.length; i++) {
    await ctx.api.sendMessage(
      users[i].id,
      'Новая игра появилась, регистрируйся скорее! Жми /afisha, чтобы посмотреть все доступные мероприятия!'
    )
  }
}
