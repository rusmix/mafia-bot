// PlayerList.tsx
import React from 'react';
import { IPlayer, Roles } from '../../src/models/Game';
interface PlayerListProps {
  players: IPlayer[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <ul>
      {players.map((player) => (
        <li key={player.id as string}>
          {player.name} -{' '}
          {player.role ? player.role : 'Введите роль'}
        </li>
      ))}
    </ul>
  );
};

export default PlayerList;
