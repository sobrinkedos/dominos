import React, { useState } from 'react';

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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type: selectedType,
      winningTeam: selectedType === 'draw' ? null : winningTeam,
    });
    setSelectedType('');
    setWinningTeam(null);
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
                    onChange={() => setWinningTeam(1)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    required
                  />
                  <span className="ml-2">{game.team1.join(' & ')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="winningTeam"
                    value="2"
                    checked={winningTeam === 2}
                    onChange={() => setWinningTeam(2)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                    required
                  />
                  <span className="ml-2">{game.team2.join(' & ')}</span>
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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GameResultModal;
