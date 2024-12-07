import React, { useState, useEffect } from 'react';

const resultTypes = [
  { id: 'simple', label: 'Batida Simples', points: 1 },
  { id: 'carroca', label: 'Batida de Carroça', points: 2 },
  { id: 'la-e-lo', label: 'Batida de Lá-e-Lô', points: 3 },
  { id: 'cruzada', label: 'Batida de Cruzada', points: 4 },
  { id: 'draw', label: 'Partida Empatada', points: 0 },
];

function GameResultModal({ isOpen, onClose, onSubmit, game }) {
  const [selectedType, setSelectedType] = useState('');
  const [winningTeam, setWinningTeam] = useState(null);
  const [team1Name, setTeam1Name] = useState('Time 1');
  const [team2Name, setTeam2Name] = useState('Time 2');

  // Resetar estado quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setSelectedType('');
      setWinningTeam(null);
    }
  }, [isOpen]);

  // Atualizar nomes das equipes quando o jogo mudar
  useEffect(() => {
    if (!game) {
      setTeam1Name('Time 1');
      setTeam2Name('Time 2');
      return;
    }

    try {
      const players = JSON.parse(localStorage.getItem('players') || '[]');
      
      const getPlayerName = (playerId) => {
        const player = players.find(p => p.id === playerId);
        return player ? player.name : 'Jogador';
      };

      if (Array.isArray(game.team1) && game.team1.length > 0) {
        const team1Players = game.team1.map(getPlayerName);
        setTeam1Name(team1Players.join(' & '));
      }

      if (Array.isArray(game.team2) && game.team2.length > 0) {
        const team2Players = game.team2.map(getPlayerName);
        setTeam2Name(team2Players.join(' & '));
      }
    } catch (error) {
      console.error('Erro ao carregar nomes dos jogadores:', error);
    }
  }, [game]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type: selectedType,
      winningTeam: selectedType === 'draw' ? null : parseInt(winningTeam),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Resultado da Partida</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Resultado
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                if (e.target.value === 'draw') {
                  setWinningTeam(null);
                }
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecione o tipo de resultado</option>
              {resultTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label} ({type.points} {type.points === 1 ? 'ponto' : 'pontos'})
                </option>
              ))}
            </select>
          </div>

          {selectedType && selectedType !== 'draw' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dupla Vencedora
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="winningTeam"
                    value="1"
                    checked={winningTeam === 1}
                    onChange={(e) => setWinningTeam(parseInt(e.target.value))}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    required
                  />
                  <span className="ml-2">{team1Name}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="winningTeam"
                    value="2"
                    checked={winningTeam === 2}
                    onChange={(e) => setWinningTeam(parseInt(e.target.value))}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    required
                  />
                  <span className="ml-2">{team2Name}</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameResultModal;
