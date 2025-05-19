
import React from 'react';

const SearchFilters = () => {
  const dateFilters = [
    { id: 'today', label: 'Hoje' },
    { id: 'tomorrow', label: 'Amanhã' },
    { id: 'this-week', label: 'Esta Semana' },
    { id: 'weekend', label: 'Fim de Semana' },
    { id: 'this-month', label: 'Esse mês' },
    { id: 'next-month', label: 'A partir do próximo mês' },
  ];

  const categoryFilters = [
    { id: 'athletics', label: 'Atléticas' },
    { id: 'bars', label: 'Bares e Baladas' },
    { id: 'events', label: 'Produtoras de Evento' },
    { id: 'championships', label: 'Campeonatos' },
    { id: 'academic', label: 'Comunidade Acadêmica' },
  ];

  return (
    <div className="bg-cuencos-black p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Filtros</h2>
      
      <div className="mb-8">
        <h3 className="text-white font-medium mb-3">Data</h3>
        <ul className="space-y-2">
          {dateFilters.map((filter) => (
            <li key={filter.id} className="flex items-center">
              <input
                type="checkbox"
                id={filter.id}
                className="w-4 h-4 mr-3 accent-cuencos-purple"
              />
              <label htmlFor={filter.id} className="text-white text-sm cursor-pointer">
                {filter.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="border-t border-gray-700 my-6"></div>
      
      <div>
        <h3 className="text-white font-medium mb-3">Categoria</h3>
        <ul className="space-y-2">
          {categoryFilters.map((filter) => (
            <li key={filter.id} className="flex items-center">
              <input
                type="checkbox"
                id={filter.id}
                className="w-4 h-4 mr-3 accent-cuencos-purple"
              />
              <label htmlFor={filter.id} className="text-white text-sm cursor-pointer">
                {filter.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchFilters;
