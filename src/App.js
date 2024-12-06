import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Competitions from './pages/Competitions';
import CompetitionDetails from './pages/CompetitionDetails';
import Players from './pages/Players';
import Statistics from './pages/Statistics';
import Login from './pages/Login';
import Register from './pages/Register';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Não mostrar drawer nas páginas de login e registro
  if (['/login', '/register'].includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative pb-16 md:pb-0">
      {/* Overlay escuro quando o drawer está aberto */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleDrawer}
        ></div>
      )}

      {/* Drawer Mobile */}
      <div className={`fixed inset-y-0 left-0 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="text-xl font-bold text-gray-800">Dominó Score</div>
            <button onClick={toggleDrawer} className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <Link to="/" onClick={toggleDrawer} className="text-gray-600 hover:text-gray-900">Início</Link>
            <Link to="/competitions" onClick={toggleDrawer} className="text-gray-600 hover:text-gray-900">Competições</Link>
            <Link to="/players" onClick={toggleDrawer} className="text-gray-600 hover:text-gray-900">Jogadores</Link>
            <Link to="/statistics" onClick={toggleDrawer} className="text-gray-600 hover:text-gray-900">Estatísticas</Link>
            <button
              onClick={() => {
                logout();
                toggleDrawer();
              }}
              className="text-gray-600 hover:text-gray-900 text-left"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={toggleDrawer}
                className="md:hidden text-gray-600 hover:text-gray-900 mr-4"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="text-xl font-bold text-gray-800">Dominó Score</div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Início</Link>
              <Link to="/competitions" className="text-gray-600 hover:text-gray-900">Competições</Link>
              <Link to="/players" className="text-gray-600 hover:text-gray-900">Jogadores</Link>
              <Link to="/statistics" className="text-gray-600 hover:text-gray-900">Estatísticas</Link>
              <span className="text-gray-600">|</span>
              <span className="text-gray-600">{user?.name}</span>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/competitions"
              element={
                <PrivateRoute>
                  <Competitions />
                </PrivateRoute>
              }
            />
            <Route
              path="/competitions/:id"
              element={
                <PrivateRoute>
                  <CompetitionDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/players"
              element={
                <PrivateRoute>
                  <Players />
                </PrivateRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <PrivateRoute>
                  <Statistics />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </main>

      {/* Bottom Navigation para Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around items-center h-16">
          <Link 
            to="/"
            className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === '/' ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Início</span>
          </Link>

          <Link 
            to="/competitions"
            className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === '/competitions' ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-xs mt-1">Competições</span>
          </Link>

          <Link 
            to="/players"
            className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === '/players' ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs mt-1">Jogadores</span>
          </Link>

          <Link 
            to="/statistics"
            className={`flex flex-col items-center justify-center w-full h-full ${location.pathname === '/statistics' ? 'text-blue-500' : 'text-gray-600'}`}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs mt-1">Estatísticas</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default App;
