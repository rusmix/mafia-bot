import bot from '@/helpers/bot';
import { eventsKeyboard } from '@/helpers/keyboards';
import Context from '@/models/Context';
import { EventModel } from '@/models/Event';

export default async function showPlayers(ctx: Context) {
  let media = [];
  console.log(ctx.session.currentTitle);
  const event = await EventModel.findOne({ title: ctx.session.currentTitle });

  const players = event.players;
  console.log('players!!!!!!!!!', players);
  if (players.length === 0) return await ctx.answerCallbackQuery();
  let text = 'Игроки:\n';
  let username = undefined;

  if (!ctx.dbuser.isAdmin) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].user?.usernameTg) {
        username = players[i].user.name.link(
          `t.me/${players[i].user.usernameTg}`
        );
      } else username = players[i].user.name;
      if (players[i].guests === 0) text += `${i + 1}) ${username}\n`;
      else text += `${i + 1}) ${username} + ${players[i].guests} чел\n`;
    }
  } else {
    for (let i = 0; i < players.length; i++) {
      if (players[i].user?.usernameTg) {
        username = players[i].user.name.link(
          `t.me/${players[i].user.usernameTg}`
        );
      } else {
        if (players[i].user?.name) username = players[i].user.name;
      }
      if (players[i].user.phone)
        text += `${i + 1}) ${username} + ${players[i].guests} чел. ${
          players[i].user.phone
        }\n`;
      if (!players[i].user.phone)
        text += `${i + 1}) ${username} + ${players[i].guests} чел.\n`;
    }
  }

  if (players[0].user.photoId) {
    media.push({
      type: 'photo',
      media: `${players[0].user.photoId}`,
      caption: text,
      parse_mode: 'HTML',
    });
  } else {
    media.push({
      type: 'photo',
      media: `AgACAgIAAxkBAAIEtWN0_h3QGycHDx1Coj6SQBtJ0XAYAAJywjEbSGipS6UqOgg2OOyVAQADAgADeAADKwQ`,
      caption: text,
      parse_mode: 'HTML',
    });
  }

  if (players.length < 10) {
    for (let i = 1; i < players.length; i++) {
      if (players[i].user.photoId)
        media.push({
          type: 'photo',
          media: `${players[i].user.photoId}`,
        });
    }
    console.log(media);
    await ctx.deleteMessage();
    await bot.api.sendMediaGroup(ctx.from.id, media);
  } else {
    for (let i = 1; i < players.length; i++) {
      if (players[i].user.photoId)
        media.push({
          type: 'photo',
          media: `${players[i].user.photoId}`,
        });
      if (i % 9 === 0) {
        await bot.api.sendMediaGroup(ctx.from.id, media);
        media = [];
      }
    }
    await bot.api.sendMediaGroup(ctx.from.id, media);
  }
}
