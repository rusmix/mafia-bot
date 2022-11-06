import { oneEventHandler as OneAdminEventHandler } from '../handlers/admin/OneEventHandler'
import Context from '@/models/Context'
import bot from '@/helpers/bot'
import getTitles from './getTitles'
import oneEventHandler from '@/handlers/OneEventHandler'

export default async function setCallback() {
  bot.callbackQuery(await getTitles(), async (ctx: Context) => {
    if (ctx.dbuser.isAdmin) {
      return await OneAdminEventHandler(ctx)
    }
    await oneEventHandler(ctx)
  })
}
