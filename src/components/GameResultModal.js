import React, { useState } from 'react';

const resultTypes = [
  { id: 'batida_simples', label: 'Simples', description: 'Batida normal', points: 1 },
  { id: 'carroca', label: 'Carroça', description: 'Batida com carroça', points: 2 },
  { id: 'la_e_lo', label: 'Lá e Lô', description: 'Batida especial', points: 3 },
  { id: 'cruzada', label: 'Cruzada', description: 'Batida cruzada', points: 4 },
];

function GameResultModal({ isOpen, onClose, onSubmit, game }) {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedWinner, setSelectedWinner] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const resultType = resultTypes.find(t => t.id === selectedType);
    if (!resultType || !selectedWinner) return;

    onSubmit({
      type: selectedType,
      winningTeam: selectedWinner,
      points: resultType.points,
      team1Score: selectedWinner === 1 ? resultType.points : 0,
      team2Score: selectedWinner === 2 ? resultType.points : 0
    });
  };

  if (!isOpen) return null;

  const team1Names = game.team1.map(playerId => {
    const player = JSON.parse(localStorage.getItem('players') || '[]')
      .find(p => p.id === playerId);
    return player ? player.name : '';
  }).join(' / ');

  const team2Names = game.team2.map(playerId => {
    const player = JSON.parse(localStorage.getItem('players') || '[]')
      .find(p => p.id === playerId);
    return player ? player.name : '';
  }).join(' / ');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Resultado do Jogo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Resultado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Batida
            </label>
            <div className="grid grid-cols-2 gap-2">
              {resultTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {type.points} {type.points === 1 ? 'ponto' : 'pontos'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Seleção do Vencedor */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Dupla Vencedora
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedWinner(1)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  selectedWinner === 1
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm truncate">{team1Names}</div>
                {selectedWinner === 1 && (
                  <div className="text-green-600 text-xs mt-1">
                    Vencedor
                  </div>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedWinner(2)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  selectedWinner === 2
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm truncate">{team2Names}</div>
                {selectedWinner === 2 && (
                  <div className="text-green-600 text-xs mt-1">
                    Vencedor
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!selectedType || !selectedWinner}
              className={`px-4 py-2 rounded-md text-white ${
                !selectedType || !selectedWinner
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Salvar Resultado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameResultModal;
