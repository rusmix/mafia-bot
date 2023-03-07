import { phoneKeyboard } from '@/helpers/keyboards';
import { adminState, userState } from '@/middlewares/session';
import Context from '@/models/Context';
import { UserModel } from '@/models/User';
import { runInContext } from 'vm';
import registration from './registration';
import showAfisha from './showAfisha';

export default async function start(ctx: Context) {
  const user = ctx.dbuser;
  user.isActive = true;
  await user.save();
  if (
    !user?.name ||
    !user.phone ||
    !user.photoId ||
    user.isRegistered === false
  ) {
    await ctx.reply(
      'Всем привет! Это бот для удобной записи на игру мафия в г. Москва. Для его использования, пожалуйста, пройдите небольшую регистрацию. Напишите, пожалуйста, своё имя:'
    );
    return (ctx.session.state = userState.sendName);
  }
  return await showAfisha(ctx);
}
