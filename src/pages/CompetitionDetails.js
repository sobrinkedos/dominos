import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameModal from '../components/GameModal';
import { ArrowLeftIcon, TrophyIcon } from '@heroicons/react/24/outline';

function CompetitionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState(null);
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedCompetitions = JSON.parse(localStorage.getItem('competitions') || '[]');
    const savedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    const savedGames = JSON.parse(localStorage.getItem('games') || '[]');
    
    const comp = savedCompetitions.find(c => c.id === parseInt(id));
    if (!comp) {
      navigate('/competitions');
      return;
    }

    setCompetition(comp);
    setPlayers(savedPlayers);
    setGames(savedGames.filter(g => g.competitionId === parseInt(id)));
  }, [id, navigate]);

  const handleAddGame = (gameData) => {
    const newGame = {
      id: Date.now(),
      competitionId: parseInt(id),
      ...gameData
    };

    const updatedGames = [...games, newGame];
    setGames(updatedGames);

    // Atualizar localStorage
    const allGames = JSON.parse(localStorage.getItem('games') || '[]');
    localStorage.setItem('games', JSON.stringify([...allGames, newGame]));
  };

  const handleStartCompetition = () => {
    const updatedCompetition = { ...competition, status: 'in_progress' };
    setCompetition(updatedCompetition);

    // Atualizar no localStorage
    const savedCompetitions = JSON.parse(localStorage.getItem('competitions') || '[]');
    const updatedCompetitions = savedCompetitions.map(c =>
      c.id === competition.id ? updatedCompetition : c
    );
    localStorage.setItem('competitions', JSON.stringify(updatedCompetitions));
  };

  const getPlayerName = (playerId) => {
    return players.find(p => p.id === playerId)?.name || 'Jogador não encontrado';
  };

  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('pt-BR', options);
  };

  if (!competition) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/competitions')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{competition.name}</h1>
        </div>
        <div className="flex space-x-3">
          {competition.status === 'pending' && (
            <button
              onClick={handleStartCompetition}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Iniciar Competição
            </button>
          )}
          {competition.status === 'in_progress' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Novo Jogo
            </button>
          )}
        </div>
      </div>

      {/* Informações da Competição */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Data</h3>
            <p className="mt-1 text-lg text-gray-900">{formatDate(competition.date)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-lg text-gray-900">{
              competition.status === 'pending' ? 'Pendente' :
              competition.status === 'in_progress' ? 'Em Andamento' :
              'Finalizada'
            }</p>
          </div>
        </div>
      </div>

      {/* Lista de Jogos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Jogos</h2>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {games.map((game) => (
              <li key={game.id} className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-3 gap-4">
                  {/* Time 1 */}
                  <div className={`text-center ${game.winner === 1 ? 'font-bold' : ''}`}>
                    <div className="space-y-1">
                      <p>{getPlayerName(game.team1[0])}</p>
                      <p>{getPlayerName(game.team1[1])}</p>
                      <p className="text-2xl font-bold text-gray-900">{game.score1}</p>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">{formatDate(game.date)}</p>
                      <p className="text-lg font-bold text-gray-400">VS</p>
                    </div>
                  </div>

                  {/* Time 2 */}
                  <div className={`text-center ${game.winner === 2 ? 'font-bold' : ''}`}>
                    <div className="space-y-1">
                      <p>{getPlayerName(game.team2[0])}</p>
                      <p>{getPlayerName(game.team2[1])}</p>
                      <p className="text-2xl font-bold text-gray-900">{game.score2}</p>
                    </div>
                  </div>
                </div>

                {/* Indicador de Vencedor */}
                <div className="mt-2 flex justify-center">
                  {game.winner && (
                    <div className={`flex items-center space-x-1 text-sm ${
                      game.winner === 1 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      <TrophyIcon className="h-4 w-4" />
                      <span>Time {game.winner} venceu!</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
            {games.length === 0 && (
              <li className="px-4 py-5 text-center text-gray-500">
                Nenhum jogo registrado
              </li>
            )}
          </ul>
        </div>
      </div>

      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        players={players.filter(p => competition.players.includes(p.id))}
        onSubmit={handleAddGame}
      />
    </div>
  );
}

export default CompetitionDetails;
