import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GameForm({ players, onSubmit, onCancel, competitionId }) {
  const [formData, setFormData] = useState({
    team1: ['', ''],
    team2: ['', '']
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar se todos os jogadores foram selecionados
    if (formData.team1.includes('') || formData.team2.includes('')) {
      alert('Por favor, selecione todos os jogadores');
      return;
    }

    const newGame = {
      id: Date.now(),
      competitionId,
      team1: formData.team1,
      team2: formData.team2,
      matches: [{
        id: Date.now(),
        number: 1,
        result: null,
        team1Score: 0,
        team2Score: 0,
        completed: false
      }],
      completed: false,
      winner: null,
      createdAt: new Date().toISOString()
    };

    // Salvar o novo jogo
    const games = JSON.parse(localStorage.getItem('games') || '[]');
    games.push(newGame);
    localStorage.setItem('games', JSON.stringify(games));

    // Disparar evento de atualização
    window.dispatchEvent(new Event('gamesUpdated'));

    onSubmit(newGame);
    navigate(`/games/${newGame.id}`);
  };

  const handlePlayerSelect = (team, position, playerId) => {
    const newTeam = [...formData[`team${team}`]];
    newTeam[position] = playerId;
    setFormData({ ...formData, [`team${team}`]: newTeam });
  };

  const handleRandomTeams = () => {
    // Filtrar jogadores que não estão em nenhum time
    const availablePlayers = [...players];
    
    // Embaralhar array de jogadores
    for (let i = availablePlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePlayers[i], availablePlayers[j]] = [availablePlayers[j], availablePlayers[i]];
    }

    // Selecionar 4 jogadores aleatórios
    const selectedPlayers = availablePlayers.slice(0, 4);

    setFormData({
      team1: [selectedPlayers[0].id, selectedPlayers[1].id],
      team2: [selectedPlayers[2].id, selectedPlayers[3].id]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleRandomTeams}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sortear Times
        </button>
      </div>

      {/* Time 1 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Time 1</h3>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((position) => (
            <div key={`team1-${position}`}>
              <label className="block text-sm font-medium text-gray-700">
                Jogador {position + 1}
              </label>
              <select
                value={formData.team1[position]}
                onChange={(e) => handlePlayerSelect(1, position, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um jogador</option>
                {players.map((player) => (
                  <option
                    key={player.id}
                    value={player.id}
                    disabled={
                      formData.team1.includes(player.id) ||
                      formData.team2.includes(player.id)
                    }
                  >
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Time 2 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Time 2</h3>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((position) => (
            <div key={`team2-${position}`}>
              <label className="block text-sm font-medium text-gray-700">
                Jogador {position + 1}
              </label>
              <select
                value={formData.team2[position]}
                onChange={(e) => handlePlayerSelect(2, position, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um jogador</option>
                {players.map((player) => (
                  <option
                    key={player.id}
                    value={player.id}
                    disabled={
                      formData.team1.includes(player.id) ||
                      formData.team2.includes(player.id)
                    }
                  >
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Criar Jogo
        </button>
      </div>
    </form>
  );
}

export default GameForm;
