import React, { useState } from 'react';

function GameForm({ players, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    team1: ['', ''],
    team2: ['', ''],
    score1: 0,
    score2: 0,
    winner: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const gameData = {
      ...formData,
      date: new Date().toISOString(),
      winner: formData.score1 > formData.score2 ? 1 : 2
    };
    onSubmit(gameData);
  };

  const handlePlayerSelect = (team, position, playerId) => {
    const newTeam = [...formData[`team${team}`]];
    newTeam[position] = playerId;
    setFormData({ ...formData, [`team${team}`]: newTeam });
  };

  const handleScoreChange = (team, value) => {
    const score = Math.max(0, Math.min(6, parseInt(value) || 0));
    setFormData({ ...formData, [`score${team}`]: score });
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
      ...formData,
      team1: [selectedPlayers[0].id, selectedPlayers[1].id],
      team2: [selectedPlayers[2].id, selectedPlayers[3].id],
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
                      (formData.team1.includes(player.id) && formData.team1[position] !== player.id) ||
                      formData.team2.includes(player.id)
                    }
                  >
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Pontuação
            </label>
            <input
              type="number"
              min="0"
              max="6"
              value={formData.score1}
              onChange={(e) => handleScoreChange(1, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
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
                      (formData.team2.includes(player.id) && formData.team2[position] !== player.id) ||
                      formData.team1.includes(player.id)
                    }
                  >
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Pontuação
            </label>
            <input
              type="number"
              min="0"
              max="6"
              value={formData.score2}
              onChange={(e) => handleScoreChange(2, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}

export default GameForm;
