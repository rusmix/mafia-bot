import { sequentialize as baseSequentialize } from '@grammyjs/runner'
import Context from '@/models/Context'

export function getSessionKey(ctx: Context) {
  if (ctx.chat?.id) return ctx.chat?.id.toString()
  if (ctx.update?.pre_checkout_query)
    // это для ботовой оплаты
    return ctx.update.pre_checkout_query.from.id.toString()
}

const sequentialize = baseSequentialize(getSessionKey)
export default sequentialize
