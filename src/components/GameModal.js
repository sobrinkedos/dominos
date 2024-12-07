import React from 'react';
import GameForm from './GameForm';

function GameModal({ isOpen, onClose, players, onSubmit, competitionId }) {
  // Validar props
  const validPlayers = Array.isArray(players) ? players : [];
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Novo Jogo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Fechar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <GameForm
          players={validPlayers}
          competitionId={competitionId}
          onSubmit={(gameData) => {
            onSubmit(gameData);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}

export default GameModal;
