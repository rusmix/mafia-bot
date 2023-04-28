import { GameModel } from './models/Game';

export default async function game(id) {
  const res = await GameModel.findOne({ id: id });
  console.log(res);
}
