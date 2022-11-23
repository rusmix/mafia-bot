/* eslint-disable import/prefer-default-export */
import getTitles from '@/helpers/getTitles';
import {
  eventsKeyboard,
  navigationKeyboard,
  oneEventAdminKeyboard,
  oneEventKeyboard,
} from '@/helpers/keyboards';
import Context from '@/models/Context';
import { EventModel } from '@/models/Event';
import { UserModel } from '@/models/User';

export async function banUser(ctx: Context) {
  if (ctx.dbuser.isAdmin) {
    let phone = ctx.message.text.split(' ')[1];

    if (phone.startsWith('+')) phone = phone.slice(1);

    const user = await UserModel.findOne({ phone: phone });
    if (!user)
      return await ctx.reply(
        'Пользователь не найден, попробуйте проверить телефон. Он должен быть в формате +79991233213'
      );

    user.isBanned = true;
    await user.save();

    let events = await EventModel.find({ isActual: true });
    events = events.filter((ev) =>
      ev.players.find((player) => player.user.id === user.id)
    );
    events.map((ev) => {
      const player =
        ev.players[
          ev.players.findIndex((player) => player.user.id === user.id)
        ];
      ev.amountOfPlayers -= player.guests + 1;
      ev.players.splice(
        ev.players.findIndex((player) => player.user.id === user.id),
        1
      );
    });
    await Promise.all(events.map(async (ev) => await ev.save()));
  }
}
