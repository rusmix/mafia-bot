import { EventModel } from '@/models/Event';
import Context from '@/models/Context';
import { GameModel, IPlayer, Status, Roles } from '@/models/Game';
import { IPluginsArray } from '@typegoose/typegoose/lib/types';
import { startGameKeyboard } from '@/helpers/keyboards';

export default async function initiateGame(ctx: Context) {
  const event = await EventModel.findOne({ title: ctx.session.currentTitle });

  const game = new GameModel();
  game.players = new Array<IPlayer>(event.amountOfPlayers);

  event.players.forEach((el, i) => {
    game.players[i] = {
      id: el.user._id,
      name: el.user.name,
      role: Roles.default,
      points: 0,
      status: Status.default,
      votedTo: null,
    };
  });
  console.log(game);
  console.log(game.players);
  await game.save((error) => {
    if (error) {
      console.log('Error saving game:', error);
    } else {
      console.log('Game saved successfully');
    }
  });
  await ctx.editMessageReplyMarkup({
    reply_markup: startGameKeyboard(game._id),
  });

  // await ctx.reply('тут ссылка на сайт', {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument

  // });
}
