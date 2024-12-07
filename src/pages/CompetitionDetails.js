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
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [showGameModal, setShowGameModal] = useState(false);

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
        console.log('Estrutura dos jogos:', competitionGames);
        
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

  // Função para obter o nome do jogador pelo ID
  const getPlayerName = (playerId) => {
    if (!playerId) return '';
    const player = players.find(p => p.id === parseInt(playerId));
    return player ? player.name : '';
  };

  // Função para formatar os nomes da dupla
  const getTeamNames = (team) => {
    if (!team || !Array.isArray(team)) return '';
    return team.map(playerId => getPlayerName(playerId)).filter(name => name).join(' / ');
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

  const calculatePlayerStats = (playerId) => {
    const playerGames = games.filter(game => 
      game.team1Players?.includes(playerId) || 
      game.team2Players?.includes(playerId)
    );

    const wins = playerGames.filter(game => {
      const isTeam1 = game.team1Players?.includes(playerId);
      return isTeam1 ? game.score1 > game.score2 : game.score2 > game.score1;
    }).length;

    return {
      totalGames: playerGames.length,
      wins: wins,
      losses: playerGames.length - wins,
      winRate: playerGames.length > 0 ? ((wins / playerGames.length) * 100).toFixed(1) : 0
    };
  };

  const handleRemovePlayer = (playerId) => {
    try {
      // Verificar se o jogador está em algum jogo
      const playerInGames = games.some(game => 
        game.team1Players?.includes(playerId) || 
        game.team2Players?.includes(playerId)
      );

      if (playerInGames) {
        alert('Não é possível remover um jogador que já participou de jogos.');
        return;
      }

      // Atualizar competição
      const updatedCompetition = {
        ...competition,
        players: competition.players.filter(id => id !== playerId)
      };

      // Atualizar localStorage
      const savedCompetitions = JSON.parse(localStorage.getItem('competitions') || '[]');
      const updatedCompetitions = savedCompetitions.map(c =>
        c.id === competition.id ? updatedCompetition : c
      );
      localStorage.setItem('competitions', JSON.stringify(updatedCompetitions));

      // Atualizar estado
      setCompetition(updatedCompetition);
      const removedPlayer = players.find(p => p.id === playerId);
      setPlayers(players.filter(p => p.id !== playerId));
      setAvailablePlayers([...availablePlayers, removedPlayer]);
    } catch (error) {
      console.error('Erro ao remover jogador:', error);
      alert('Erro ao remover jogador. Por favor, tente novamente.');
    }
  };

  if (!competition) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {competition.name}
          </h1>
        </div>

        {/* Mensagem quando não há jogadores */}
        {players.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500">
              Adicione jogadores para começar os jogos
            </p>
          </div>
        )}

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
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

        {/* Seção de Jogos */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Jogos da Competição</h2>
            <button
              onClick={() => setShowGameModal(true)}
              disabled={players.length < 4}
              className={`px-4 py-2 rounded ${
                players.length < 4
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Novo Jogo
            </button>
          </div>
          <div className="space-y-4">
            {games.map((game, index) => (
              <div
                key={game.id}
                onClick={() => navigate(`/games/${game.id}`)}
                className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold">
                    Jogo #{index + 1}
                  </div>
                  <div className="text-lg font-bold">
                    {game.score1} x {game.score2}
                  </div>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <div className={`text-center ${game.score1 > game.score2 ? 'font-bold text-green-600' : ''}`}>
                    {getTeamNames(game.team1)}
                  </div>
                  <div className="text-center text-gray-500 flex items-center justify-center">
                    <span className="bg-gray-100 px-2 py-1 rounded">vs</span>
                  </div>
                  <div className={`text-center ${game.score2 > game.score1 ? 'font-bold text-green-600' : ''}`}>
                    {getTeamNames(game.team2)}
                  </div>
                </div>
                <div className="mt-2 text-center text-sm">
                  {game.score1 !== game.score2 && (
                    <span className="text-green-600">
                      Vencedor: {game.score1 > game.score2 ? getTeamNames(game.team1) : getTeamNames(game.team2)}
                    </span>
                  )}
                  {game.score1 === game.score2 && (
                    <span className="text-yellow-600">
                      Jogo empatado
                    </span>
                  )}
                </div>
              </div>
            ))}
            {games.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                Nenhum jogo registrado ainda.
              </p>
            )}
          </div>
        </div>

        {/* Seção de Jogadores */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Jogadores</h2>
            <button
              onClick={() => setIsAddingPlayer(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Adicionar Jogador
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => {
              const stats = calculatePlayerStats(player.id);
              return (
                <div key={player.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{player.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePlayer(player.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Jogos: {stats.totalGames}</div>
                    <div className="text-gray-600">Vitórias: {stats.wins}</div>
                    <div className="text-gray-600">Derrotas: {stats.losses}</div>
                    <div className="text-gray-600">Taxa: {stats.winRate}%</div>
                  </div>
                </div>
              );
            })}
            {players.length === 0 && (
              <p className="text-gray-500 text-center py-4 col-span-full">
                Nenhum jogador adicionado ainda.
              </p>
            )}
          </div>
        </div>

        {/* Game Modal */}
        {showGameModal && (
          <GameModal
            isOpen={showGameModal}
            onClose={() => setShowGameModal(false)}
            onSubmit={handleAddGame}
            players={players}
            competitionId={competition.id}
          />
        )}
      </div>
    </div>
  );
}

export default CompetitionDetails;
