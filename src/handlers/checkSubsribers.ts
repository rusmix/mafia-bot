import { UserModel } from '@/models/User'
import Context from '@/models/Context'

export default async function checkSubscribers(ctx: Context) {
  const amountOfUsers = (await UserModel.find()).length

  const textUsers = `Кол-во пользователей: ${amountOfUsers}\n\n`

  await ctx.reply(textUsers)
}
