import React from 'react';

function Competitions() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Competições</h1>
      
      {/* Lista de Competições */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Competições Ativas</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {/* Exemplo de competição */}
            <div className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Torneio de Verão</h3>
                  <p className="text-sm text-gray-500">8 jogadores • Em andamento</p>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Nova Competição */}
      <button className="fixed bottom-20 right-4 md:bottom-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}

export default Competitions;
