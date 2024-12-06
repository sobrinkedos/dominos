import React, { useState, useEffect } from 'react';
import CompetitionModal from '../components/CompetitionModal';
import { PencilIcon, TrashIcon, PlayIcon, CheckIcon } from '@heroicons/react/24/outline';

function Competitions() {
  const [competitions, setCompetitions] = useState(() => {
    const savedCompetitions = localStorage.getItem('competitions');
    return savedCompetitions ? JSON.parse(savedCompetitions) : [];
  });
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  useEffect(() => {
    localStorage.setItem('competitions', JSON.stringify(competitions));
  }, [competitions]);

  useEffect(() => {
    const savedPlayers = localStorage.getItem('players');
    setPlayers(savedPlayers ? JSON.parse(savedPlayers) : []);
  }, []);

  const handleAddCompetition = (competitionData) => {
    const newCompetition = {
      id: Date.now(),
      ...competitionData
    };
    setCompetitions([...competitions, newCompetition]);
  };

  const handleEditCompetition = (competitionData) => {
    setCompetitions(competitions.map(c => 
      c.id === selectedCompetition.id ? { ...c, ...competitionData } : c
    ));
  };

  const handleDeleteCompetition = (competitionId) => {
    if (window.confirm('Tem certeza que deseja excluir esta competição?')) {
      setCompetitions(competitions.filter(c => c.id !== competitionId));
    }
  };

  const handleStatusChange = (competitionId, newStatus) => {
    setCompetitions(competitions.map(c => 
      c.id === competitionId ? { ...c, status: newStatus } : c
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'in_progress':
        return 'text-blue-600';
      case 'finished':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'finished':
        return 'Finalizada';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const getPlayerNames = (playerIds) => {
    return playerIds
      .map(id => players.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const openEditModal = (competition) => {
    setSelectedCompetition(competition);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCompetition(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Competições</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Nova Competição
        </button>
      </div>

      {/* Lista de Competições */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {competitions.map((competition) => (
            <li key={competition.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{competition.name}</h3>
                    <span className={`${getStatusColor(competition.status)} text-sm`}>
                      {getStatusText(competition.status)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>Data: {formatDate(competition.date)}</p>
                    <p>Jogadores: {getPlayerNames(competition.players) || 'Nenhum jogador selecionado'}</p>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-3">
                  {competition.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(competition.id, 'in_progress')}
                      className="text-blue-600 hover:text-blue-900"
                      title="Iniciar Competição"
                    >
                      <PlayIcon className="h-5 w-5" />
                    </button>
                  )}
                  {competition.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange(competition.id, 'finished')}
                      className="text-green-600 hover:text-green-900"
                      title="Finalizar Competição"
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(competition)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCompetition(competition.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {competitions.length === 0 && (
            <li className="px-6 py-4 text-center text-gray-500">
              Nenhuma competição cadastrada
            </li>
          )}
        </ul>
      </div>

      <CompetitionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        competition={selectedCompetition}
        onSubmit={selectedCompetition ? handleEditCompetition : handleAddCompetition}
      />
    </div>
  );
}

export default Competitions;
