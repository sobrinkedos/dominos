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
    const loadData = () => {
      try {
        const savedCompetitions = JSON.parse(localStorage.getItem('competitions') || '[]');
        const savedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
        const savedGames = JSON.parse(localStorage.getItem('games') || '[]');
        
        console.log('ID da competição:', id);
        console.log('Jogos salvos:', savedGames);
        
        const comp = savedCompetitions.find(c => c.id === parseInt(id));
        if (!comp) {
          console.log('Competição não encontrada');
          navigate('/competitions');
          return;
        }

        setCompetition(comp);
        setPlayers(savedPlayers);

        // Filtrar jogos desta competição e calcular pontuações
        const competitionGames = savedGames.filter(g => {
          console.log('Comparando:', g.competitionId, parseInt(id));
          return g.competitionId === parseInt(id);
        });
        
        console.log('Jogos da competição:', competitionGames);

        const gamesWithScores = competitionGames.map(game => {
          const matches = game.matches || [];
          const totalScore1 = matches.reduce((sum, match) => sum + (match?.team1Score || 0), 0);
          const totalScore2 = matches.reduce((sum, match) => sum + (match?.team2Score || 0), 0);
          
          return {
            ...game,
            score1: totalScore1,
            score2: totalScore2,
            winner: game.winner || (totalScore1 >= 6 ? 1 : totalScore2 >= 6 ? 2 : null)
          };
        });

        console.log('Jogos com pontuação:', gamesWithScores);
        setGames(gamesWithScores);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();

    // Adicionar event listeners para mudanças
    const handleStorageChange = (e) => {
      if (e.key === 'games' || e.key === null) {
        console.log('Storage mudou, recarregando dados');
        loadData();
      }
    };

    const handleGamesUpdated = () => {
      console.log('Evento gamesUpdated recebido, recarregando dados');
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gamesUpdated', handleGamesUpdated);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gamesUpdated', handleGamesUpdated);
    };
  }, [id, navigate]);

  // Função para atualizar os dados quando um novo jogo é adicionado
  const handleAddGame = (gameData) => {
    const newGame = {
      id: Date.now(),
      competitionId: parseInt(id),
      ...gameData,
      matches: [{
        id: Date.now(),
        number: 1,
        result: null,
        team1Score: 0,
        team2Score: 0,
        completed: false
      }]
    };

    // Atualizar localStorage
    const allGames = JSON.parse(localStorage.getItem('games') || '[]');
    const updatedAllGames = [...allGames, newGame];
    localStorage.setItem('games', JSON.stringify(updatedAllGames));

    // Atualizar estado local
    setGames(prevGames => [...prevGames, { ...newGame, score1: 0, score2: 0 }]);
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

      {/* Lista de Jogos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Jogos da Competição
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {games.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhum jogo registrado ainda.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {games.map((game) => (
                <li 
                  key={game.id} 
                  className="px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/games/${game.id}`)}
                >
                  <div className="grid grid-cols-3 gap-4">
                    {/* Time 1 */}
                    <div className={`text-center ${game.winner === 1 ? 'font-bold' : ''}`}>
                      <div className="space-y-1">
                        <p>{getPlayerName(game.team1?.[0])}</p>
                        <p>{getPlayerName(game.team1?.[1])}</p>
                        <p className="text-2xl font-bold text-gray-900">{game.score1}</p>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">{formatDate(game.createdAt)}</p>
                        <p className="text-lg font-bold text-gray-400">VS</p>
                      </div>
                    </div>

                    {/* Time 2 */}
                    <div className={`text-center ${game.winner === 2 ? 'font-bold' : ''}`}>
                      <div className="space-y-1">
                        <p>{getPlayerName(game.team2?.[0])}</p>
                        <p>{getPlayerName(game.team2?.[1])}</p>
                        <p className="text-2xl font-bold text-gray-900">{game.score2}</p>
                      </div>
                    </div>
                  </div>

                  {/* Indicador de Status */}
                  <div className="mt-2 flex justify-center">
                    {game.completed ? (
                      <div className={`flex items-center space-x-1 text-sm ${
                        game.winner === 1 ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        <TrophyIcon className="h-4 w-4" />
                        <span>Time {game.winner} venceu!</span>
                      </div>
                    ) : (
                      <span className="text-sm text-yellow-600">
                        Jogo em andamento
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal de Novo Jogo */}
      <GameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddGame}
        players={players}
        competitionId={competition.id}
      />
    </div>
  );
}

export default CompetitionDetails;
