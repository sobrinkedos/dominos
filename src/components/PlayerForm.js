import React, { useState } from 'react';

function PlayerForm({ onSubmit, onCancel, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [nickname, setNickname] = useState(initialData?.nickname || '');
  const [phone, setPhone] = useState(initialData?.phone || '');

  const handlePhoneChange = (e) => {
    // Remove qualquer caractere que não seja número
    const value = e.target.value.replace(/\D/g, '');
    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (value.length <= 11) {
      setPhone(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id || Date.now(),
      name,
      nickname,
      phone
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
          Apelido
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          maxLength="11"
          placeholder="DDD + Número (apenas números)"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Digite apenas números: DDD + número (máximo 11 dígitos)
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}

export default PlayerForm;
