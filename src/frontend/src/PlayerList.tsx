import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Player {
  id?: string;
  name?: string;
  role?: string;
  points?: number;
  status?: string;
  votedTo?: string;
}

interface PlayerListProps {}

const PlayerList: React.FC<PlayerListProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [playerList, setPlayerList] = useState<Player[]>();

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const game = await fetch(`http://localhost:4002/api/games/${id}`);
        const data = await game.json();
        setPlayerList(data.players);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    }
    fetchPlayers();
  }, [id]);

  console.log(playerList);

  const handleNameChange = (id: string, newName: string) => {
    const updatedPlayers =
      playerList &&
      playerList.map((player) =>
        player.id === id ? { ...player, name: newName } : player
      );
    setPlayerList(updatedPlayers);
  };

  const handleRoleChange = (id: string, newRole: string) => {
    const updatedPlayers =
      playerList &&
      playerList.map((player) =>
        player.id === id ? { ...player, role: newRole } : player
      );
    setPlayerList(updatedPlayers);
  };

  const saveChanges = () => {
    // Call your API to save changes
    // For example:
    // axios.post('/api/save', playerList)
    console.log('Saving changes', playerList);

    // Redirect to another page
    window.location.href = '/anotherPage';
  };

  return (
    <div>
      {playerList && playerList.map((player, index) => (
        <div key={player.id || index}>
          <input
            type="text"
            placeholder="Name"
            value={player.name || ''}
            onChange={(e) => handleNameChange(player.id || '', e.target.value)}
          />
          <input
            type="text"
            placeholder="Role"
            value={player.role || ''}
            onChange={(e) => handleRoleChange(player.id || '', e.target.value)}
          />
        </div>
      ))}
      <button onClick={saveChanges}>Save All</button>
    </div>
  );
};

export default PlayerList;
