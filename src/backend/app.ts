import { GameModel } from '@/models/Game';
import express from 'express';
export function startWebServer() {
  const app = express();

  app.get('/api/games/:id', async (req, res) => {
    const id = req.params.id;
    const games = await GameModel.findOne({ _id: id });
    if (!games) res.status(404).send({ error: 'NOT_FOUND' });
    res.status(200).json(games);
  });

  app.listen(3001, () =>
    console.log('Server running on http://localhost:3000')
  );
}
