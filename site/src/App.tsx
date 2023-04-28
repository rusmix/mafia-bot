import React from 'react';
import logo from './logo.svg';
import './App.css';
import PlayerList from './PlayerList';
import { Roles, Status } from '../../src/models/Game';

function App() {
  const game = {
    players: [
      {
        id: '1',
        name: 'Alice',
        role: Roles.doctor,
        points: 0,
        status: Status.alive,
      },
      {
        id: '2',
        name: 'Bob',
        role: Roles.yaponchik,
        points: 0,
        status: Status.alive,
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <PlayerList players={game.players} />
      </header>
    </div>
  );
}

export default App;
