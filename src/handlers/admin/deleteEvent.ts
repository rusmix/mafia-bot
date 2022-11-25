import getTitles from '@/helpers/getTitles';
import {
  editEventKeyboard,
  eventsKeyboard,
  navigationKeyboard,
  oneEventKeyboard,
  yesOrNoKeyboard,
} from '@/helpers/keyboards';
import Context from '@/models/Context';
import { EventModel } from '@/models/Event';
import { UserModel } from '@/models/User';
import { oneEventHandler } from './OneEventHandler';

export default async function editEvent(ctx: Context) {
  const event = await EventModel.findOne({
    title: ctx.session.currentTitle,
    isActual: true,
  });

  if (!event) return await ctx.reply('Событие уже удалено.');

  if (ctx.match === 'yes') {
    event.isActual = false;
    await event.save();
    await ctx.editMessageMedia({
      type: 'photo',
      media: `${event.photoId}`,
      caption: `Успешно удалено: ${event.title}`,
    });
    return await Promise.all(
      //добавляем игроку игру
      await event.players.map(async (player) => {
        const user = await UserModel.findOne({ id: player.user.id });
        console.log(player.user.id, '1) user is: ', user);
        await UserModel.updateOne(
          { id: player.user.id },
          {
            $set: {
              thisMonthStats: {
                gamesTotal: user.thisMonthStats.gamesTotal + 1,
              },
            },
          }
        );
        // user.thisMonthStats.gamesTotal = user.thisMonthStats.gamesTotal + 1;
        // console.log(player.user.id, '2) user is: ', user);
        // const user2 = await user.save();
        // console.log('user2 is ', user2);
        return;
      })
    );
  }
  if (ctx.match === 'no') {
    return await oneEventHandler(ctx);
  }
  // await ctx.editMessageCaption()

  await ctx.editMessageMedia(
    {
      type: 'photo',
      media: `${event.photoId}`,
      caption: `Вы точно хотите удалить ${event.title}?`,
    },
    { reply_markup: yesOrNoKeyboard }
  );
  // await ctx.
}
