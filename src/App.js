import React, { useState } from 'react';

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
            <div className="text-xl font-bold text-gray-800">Dominos</div>
            <button onClick={toggleDrawer} className="text-gray-600 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Menu</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contato</a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Botão do menu mobile movido para a esquerda */}
              <button 
                onClick={toggleDrawer}
                className="md:hidden text-gray-600 hover:text-gray-900 mr-4"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="text-xl font-bold text-gray-800">Dominos</div>
            </div>
            {/* Links de navegação para desktop */}
            <div className="hidden md:flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Menu</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contato</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo ao Dominos
            </h1>
            <p className="text-gray-600">
              Experimente as melhores pizzas da cidade, feitas com ingredientes frescos e muito amor.
            </p>
            <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Fazer Pedido
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
