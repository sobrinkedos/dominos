import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameResultModal from '../components/GameResultModal';

function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [animatedScore1, setAnimatedScore1] = useState(0);
  const [animatedScore2, setAnimatedScore2] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Carregar dados do jogo do localStorage
    const games = JSON.parse(localStorage.getItem('games') || '[]');
    const foundGame = games.find(g => g.id === id);
    
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
      }
      setGame(foundGame);
      // Define a partida atual como a última partida não completada
      const currentMatch = foundGame.matches.find(m => !m.completed);
      setCurrentMatch(currentMatch);
    }
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

  const handleResultSubmit = (result) => {
    if (!game || !currentMatch) return;

    const games = JSON.parse(localStorage.getItem('games') || '[]');
    const gameIndex = games.findIndex(g => g.id === id);
    
    if (gameIndex === -1) return;

    // Atualizar o resultado da partida atual
    const updatedGame = { ...game };
    const matchIndex = updatedGame.matches.findIndex(m => m.id === currentMatch.id);
    
    if (matchIndex === -1) return;

    // Calcular pontuação baseada no tipo de resultado
    let points = 0;
    let extraPoint = false;
    
    switch (result.type) {
      case 'simple':
        points = 1;
        break;
      case 'carroca':
        points = 2;
        break;
      case 'la-e-lo':
        points = 3;
        break;
      case 'cruzada':
        points = 4;
        break;
      case 'draw':
        points = 0;
        extraPoint = true;
        break;
      default:
        points = 0;
    }

    // Atualizar pontuação
    if (result.winningTeam === 1) {
      updatedGame.matches[matchIndex].team1Score = points;
      updatedGame.matches[matchIndex].team2Score = 0;
    } else if (result.winningTeam === 2) {
      updatedGame.matches[matchIndex].team1Score = 0;
      updatedGame.matches[matchIndex].team2Score = points;
    } else {
      updatedGame.matches[matchIndex].team1Score = 0;
      updatedGame.matches[matchIndex].team2Score = 0;
    }

    updatedGame.matches[matchIndex].result = result;
    updatedGame.matches[matchIndex].completed = true;

    // Se houver ponto extra da partida anterior e não for empate
    if (game.matches[matchIndex - 1]?.result?.type === 'draw' && result.winningTeam) {
      if (result.winningTeam === 1) {
        updatedGame.matches[matchIndex].team1Score += 1;
      } else {
        updatedGame.matches[matchIndex].team2Score += 1;
      }
    }

    // Calcular pontuação total
    const totalScore1 = updatedGame.matches.reduce((sum, match) => sum + match.team1Score, 0);
    const totalScore2 = updatedGame.matches.reduce((sum, match) => sum + match.team2Score, 0);

    // Verificar se o jogo deve ser encerrado (6 pontos ou mais)
    if (totalScore1 >= 6 || totalScore2 >= 6) {
      updatedGame.completed = true;
      updatedGame.winner = totalScore1 > totalScore2 ? 1 : 2;
      updatedGame.finalScore = {
        team1: totalScore1,
        team2: totalScore2
      };
    } else if (updatedGame.matches.length < 6) {
      // Criar próxima partida se o jogo não acabou
      updatedGame.matches.push({
        id: Date.now(),
        number: updatedGame.matches.length + 1,
        result: null,
        team1Score: 0,
        team2Score: 0,
        completed: false
      });
    }

    // Atualizar o jogo no localStorage
    games[gameIndex] = updatedGame;
    localStorage.setItem('games', JSON.stringify(games));
    
    setGame(updatedGame);
    setCurrentMatch(updatedGame.matches.find(m => !m.completed));
    setIsResultModalOpen(false);
  };

  if (!game) {
    return <div className="p-4">Carregando...</div>;
  }

  // Verificações de segurança para os dados do jogo
  const team1Name = game?.team1?.join(' & ') || 'Time 1';
  const team2Name = game?.team2?.join(' & ') || 'Time 2';
  const matchCount = game?.matches?.length || 0;

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
