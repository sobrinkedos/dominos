import React from 'react';

function Statistics() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Estatísticas</h1>
      
      {/* Resumo Geral */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total de Partidas</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">24</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Jogadores Ativos</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">8</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Competições</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">3</p>
        </div>
      </div>

      {/* Ranking */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Ranking Geral</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {/* Exemplo de jogador no ranking */}
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-gray-500">1º</span>
                <div>
                  <h3 className="font-medium">João Silva</h3>
                  <p className="text-sm text-gray-500">Taxa de vitória: 75%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">15 vitórias</p>
                <p className="text-sm text-gray-500">20 partidas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
