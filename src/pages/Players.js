import React from 'react';

function Players() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Jogadores</h1>
      
      {/* Lista de Jogadores */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Jogadores Cadastrados</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {/* Exemplo de jogador */}
            <div className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">João Silva</h3>
                    <p className="text-sm text-gray-500">Vitórias: 10 • Partidas: 15</p>
                  </div>
                </div>
                <button className="text-blue-500 hover:text-blue-600">
                  Ver Perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Novo Jogador */}
      <button className="fixed bottom-20 right-4 md:bottom-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}

export default Players;
