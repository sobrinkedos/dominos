import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameModal from '../components/GameModal';
import { ArrowLeftIcon, TrophyIcon, UserPlusIcon } from '@heroicons/react/24/outline';

function CompetitionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState(null);
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState([]);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedCompetitions = JSON.parse(localStorage.getItem('competitions') || '[]');
        const savedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
        const savedGames = JSON.parse(localStorage.getItem('games') || '[]');
        
        const comp = savedCompetitions.find(c => c.id === parseInt(id));
        if (!comp) {
          console.log('Competição não encontrada');
          navigate('/competitions');
          return;
        }

        // Inicializar a lista de jogadores da competição se não existir
        if (!comp.players) {
          comp.players = [];
        }

        setCompetition(comp);
        
        // Filtrar jogadores que já estão na competição
        const competitionPlayerIds = new Set(comp.players || []);
        
        // Carregar detalhes dos jogadores da competição
        const competitionPlayers = savedPlayers.filter(p => competitionPlayerIds.has(p.id));
        setPlayers(competitionPlayers);

        // Filtrar jogadores disponíveis (que não estão na competição)
        const availablePlayers = savedPlayers.filter(p => !competitionPlayerIds.has(p.id));
        setAvailablePlayers(availablePlayers);

        // Filtrar jogos desta competição
        const competitionGames = savedGames.filter(g => g.competitionId === parseInt(id));
        const gamesWithScores = competitionGames.map(game => ({
          ...game,
          score1: game.matches?.reduce((sum, match) => sum + (match?.team1Score || 0), 0) || 0,
          score2: game.matches?.reduce((sum, match) => sum + (match?.team2Score || 0), 0) || 0
        }));
        
        setGames(gamesWithScores);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleAddPlayer = () => {
    if (!selectedPlayer) return;

    try {
      // Encontrar o jogador selecionado
      const playerToAdd = availablePlayers.find(p => p.id === parseInt(selectedPlayer));
      if (!playerToAdd) {
        console.error('Jogador não encontrado:', selectedPlayer);
        return;
      }

      // Atualizar competição no estado
      const updatedCompetition = {
        ...competition,
        players: [...(competition.players || []), parseInt(selectedPlayer)]
      };
      setCompetition(updatedCompetition);

      // Atualizar competição no localStorage
      const savedCompetitions = JSON.parse(localStorage.getItem('competitions') || '[]');
      const updatedCompetitions = savedCompetitions.map(c =>
        c.id === parseInt(id) ? updatedCompetition : c
      );
      localStorage.setItem('competitions', JSON.stringify(updatedCompetitions));

      // Atualizar listas de jogadores
      setPlayers(prev => [...prev, playerToAdd]);
      setAvailablePlayers(prev => prev.filter(p => p.id !== parseInt(selectedPlayer)));

      // Resetar estado
      setSelectedPlayer('');
      setIsAddingPlayer(false);
    } catch (error) {
      console.error('Erro ao adicionar jogador:', error);
      alert('Erro ao adicionar jogador. Por favor, tente novamente.');
    }
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

  const handleAddGame = (gameData) => {
    const games = JSON.parse(localStorage.getItem('games') || '[]');
    const gameNumber = games.filter(g => g.competitionId === parseInt(id)).length + 1;
    
    const newGame = {
      id: Date.now(),
      gameNumber,
      competitionId: parseInt(id),
      ...gameData,
      matches: [{
        id: `match_${Date.now()}_1`,
        number: 1,
        result: null,
        team1Score: 0,
        team2Score: 0,
        completed: false
      }]
    };

    // Atualizar localStorage
    const updatedAllGames = [...games, newGame];
    localStorage.setItem('games', JSON.stringify(updatedAllGames));

    // Atualizar estado local
    setGames(prevGames => [...prevGames, { ...newGame, score1: 0, score2: 0 }]);
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

  const formatGameNumber = (number) => {
    return String(number).padStart(2, '0');
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
              className="bg-green-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Iniciar Competição
            </button>
          )}
          {competition.status === 'in_progress' && (
            <>
              <button
                onClick={() => setIsAddingPlayer(true)}
                className="bg-gray-500 text-white px-3 py-1.5 text-sm rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <UserPlusIcon className="h-4 w-4 inline-block mr-1" />
                Adicionar Jogador
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={players.length < 4}
                className={`px-3 py-1.5 text-sm rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  players.length < 4 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                }`}
              >
                Novo Jogo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal de Adicionar Jogador */}
      {isAddingPlayer && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Adicionar Jogador</h2>
              <button
                onClick={() => setIsAddingPlayer(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selecione um jogador
                </label>
                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {availablePlayers.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddingPlayer(false)}
                  className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddPlayer}
                  disabled={!selectedPlayer}
                  className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedPlayer
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Jogadores */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Jogadores da Competição ({players.length})
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {players.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhum jogador adicionado ainda.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {players.map((player) => (
                <li key={player.id} className="px-4 py-3">
                  {player.name}
                </li>
              ))}
            </ul>
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
