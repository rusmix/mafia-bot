import { NextFunction } from 'grammy';
import { UserModel } from '@/models/User';
import Context from '@/models/Context';
import { phoneKeyboard } from '@/helpers/keyboards';
import { userState } from './session';
import registration from '@/handlers/registration';

export default async function attachUser(ctx: Context, next: NextFunction) {
  const { doc } = await UserModel.findOrCreate({ id: ctx.from.id }); //функция для прикрепления к ctx dbuser
  ctx.dbuser = doc;

  if (ctx.dbuser.isBanned) return; // функция бана

  if (!ctx.dbuser.isRegistered && ctx.message.text !== '/start') {
    console.log(ctx.message.text);
    if (
      ctx.session.state !== userState.sendName &&
      ctx.session.state !== userState.sendPhoto &&
      ctx.session.state !== userState.sendPhone
    )
      await ctx.reply(
        'Для использования бота, пожалуйста, пройдите регистрацию.\nНажмите команду /start'
      );
    await registration(ctx);
    return;
  }
  if (!ctx.dbuser?.usernameTg && ctx.from?.username) {
    ctx.dbuser.usernameTg = ctx.from.username;
    await ctx.dbuser.save();
  }

  // if (!ctx.dbuser?.usernameTg && !ctx.from?.username) {
  // await ctx.dbuser.save()
  // }
  return next();
}
