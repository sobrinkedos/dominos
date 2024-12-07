import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameResultModal from '../components/GameResultModal';

const resultTypes = [
  { id: 'simple', points: 1 },
  { id: 'carroca', points: 2 },
  { id: 'la-e-lo', points: 3 },
  { id: 'cruzada', points: 4 },
  { id: 'draw', points: 0 },
];

function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [animatedScore1, setAnimatedScore1] = useState(0);
  const [animatedScore2, setAnimatedScore2] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGame = () => {
      try {
        const games = JSON.parse(localStorage.getItem('games')) || [];
        // Converter id para número para garantir a comparação correta
        const gameId = parseInt(id);
        console.log('Procurando jogo com ID:', gameId);
        console.log('Jogos disponíveis:', games);
        
        const foundGame = games.find(g => g.id === gameId);
        console.log('Jogo encontrado:', foundGame);
        
        if (foundGame) {
          // Se não houver partidas, criar a primeira
          if (!foundGame.matches || foundGame.matches.length === 0) {
            foundGame.matches = [{
              id: Date.now(),
              number: 1,
              result: null,
              team1Score: 0,
              team2Score: 0,
              completed: false
            }];
            
            // Atualizar o localStorage com a nova partida
            localStorage.setItem('games', JSON.stringify(games));
          }

          setGame(foundGame);
          
          // Define a partida atual como a última partida não completada
          const currentMatch = foundGame.matches.find(m => !m.completed);
          setCurrentMatch(currentMatch);
        }
      } catch (error) {
        console.error('Erro ao carregar o jogo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [id]);

  useEffect(() => {
    if (!game) return;

    // Verificações de segurança para os dados do jogo
    const team1Name = game?.team1?.join(' & ') || 'Time 1';
    const team2Name = game?.team2?.join(' & ') || 'Time 2';
    const matchCount = game?.matches?.length || 0;

    // Cálculo seguro dos pontos totais
    const totalScore1 = game?.matches?.reduce((sum, match) => sum + (match?.team1Score || 0), 0) || 0;
    const totalScore2 = game?.matches?.reduce((sum, match) => sum + (match?.team2Score || 0), 0) || 0;

    // Animar os pontos com verificações de segurança
    setIsAnimating(true);
    let frame = 0;
    const totalFrames = 20;
    const startScore1 = animatedScore1;
    const startScore2 = animatedScore2;
    
    const animate = () => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 2);
      
      setAnimatedScore1(Math.round(startScore1 + (totalScore1 - startScore1) * easeProgress));
      setAnimatedScore2(Math.round(startScore2 + (totalScore2 - startScore2) * easeProgress));

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  }, [game?.matches, animatedScore1, animatedScore2]);

  const { team1Name, team2Name, totalScore1, totalScore2, matchCount } = useMemo(() => ({
    team1Name: game?.team1?.join(' & ') || 'Time 1',
    team2Name: game?.team2?.join(' & ') || 'Time 2',
    totalScore1: game?.matches?.reduce((sum, match) => sum + (match?.team1Score || 0), 0) || 0,
    totalScore2: game?.matches?.reduce((sum, match) => sum + (match?.team2Score || 0), 0) || 0,
    matchCount: game?.matches?.length || 0
  }), [game]);

  const handleResultSubmit = (result) => {
    if (!game || !currentMatch) return;

    const games = JSON.parse(localStorage.getItem('games')) || [];
    const gameIndex = games.findIndex(g => g.id === game.id);
    
    if (gameIndex === -1) return;

    // Encontrar o tipo de resultado para saber a pontuação
    const resultType = resultTypes.find(type => type.id === result.type);
    const points = resultType?.points || 0;

    // Atualizar a partida atual com o resultado
    const updatedMatch = {
      ...currentMatch,
      completed: true,
      result: {
        type: result.type,
        winningTeam: result.winningTeam,
        points: points
      },
      team1Score: result.winningTeam === 1 ? points : 0,
      team2Score: result.winningTeam === 2 ? points : 0
    };

    // Calcular pontuação total após esta partida
    const totalScore1 = game.matches.reduce(
      (sum, match) => sum + (match.team1Score || 0), 
      0
    ) + (result.winningTeam === 1 ? points : 0);

    const totalScore2 = game.matches.reduce(
      (sum, match) => sum + (match.team2Score || 0),
      0
    ) + (result.winningTeam === 2 ? points : 0);

    // Atualizar o jogo
    const updatedGame = {
      ...game,
      matches: game.matches.map(match =>
        match.id === currentMatch.id ? updatedMatch : match
      )
    };

    // Verificar se alguma equipe atingiu 6 pontos
    if (totalScore1 >= 6 || totalScore2 >= 6) {
      // Encerrar o jogo
      updatedGame.completed = true;
      updatedGame.winner = totalScore1 >= 6 ? 1 : 2;
      updatedGame.finalScore = {
        team1: totalScore1,
        team2: totalScore2
      };
    } else {
      // Criar nova partida
      const newMatch = {
        id: Date.now(),
        number: game.matches.length + 1,
        result: null,
        team1Score: 0,
        team2Score: 0,
        completed: false
      };
      updatedGame.matches.push(newMatch);
    }

    // Atualizar no localStorage
    games[gameIndex] = updatedGame;
    localStorage.setItem('games', JSON.stringify(games));

    // Atualizar estado
    setGame(updatedGame);
    setCurrentMatch(updatedGame.completed ? null : updatedGame.matches[updatedGame.matches.length - 1]);
    setIsResultModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Jogo não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Jogo #{game.id}</h2>
        
        {/* Status do Jogo */}
        {game.completed ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Jogo Encerrado!
            </h3>
            <p className="text-green-700">
              Vencedor: {game.winner === 1 ? team1Name : team2Name}
            </p>
            <p className="text-green-700">
              Placar Final: {animatedScore1} x {animatedScore2}
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700">
              Jogo em andamento - Partida {matchCount} de no máximo 6
            </p>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div className="text-lg">
            <span className="font-semibold">{team1Name}</span>
            <span className="mx-2">vs</span>
            <span className="font-semibold">{team2Name}</span>
          </div>
          <div className={`text-3xl font-bold transition-all duration-300 ${isAnimating ? 'scale-110' : ''}`}>
            <span className={game.winner === 1 ? 'text-green-600' : ''}>{animatedScore1}</span>
            <span className="mx-2">-</span>
            <span className={game.winner === 2 ? 'text-green-600' : ''}>{animatedScore2}</span>
          </div>
        </div>

        <div className="space-y-4">
          {game.matches.map((match) => (
            <div
              key={match.id}
              className={`p-4 rounded-lg ${
                match.completed
                  ? 'bg-gray-100'
                  : 'bg-blue-50 border-2 border-blue-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">Partida {match.number}</div>
                <div className="flex items-center space-x-4">
                  <div className="font-semibold">
                    {match.team1Score} - {match.team2Score}
                  </div>
                  {!match.completed && !game.completed && (
                    <button
                      onClick={() => {
                        setCurrentMatch(match);
                        setIsResultModalOpen(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Resultado
                    </button>
                  )}
                </div>
              </div>
              {match.result && (
                <div className="mt-2 text-sm text-gray-600">
                  Resultado: {match.result.type === 'draw' ? 'Empate' : `${
                    match.result.winningTeam === 1 ? team1Name : team2Name
                  } venceu por ${match.result.type}`}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <GameResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        onSubmit={handleResultSubmit}
        game={game}
      />
    </div>
  );
}

export default GameDetails;
