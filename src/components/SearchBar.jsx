
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Todos');
  const [selectedDate, setSelectedDate] = useState('Qualquer Data');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}&location=${selectedLocation}&date=${selectedDate}`);
  };

  return (
    <div className="purple-search p-4 mx-auto max-w-4xl">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-white mb-1">Search Event</label>
          <input 
            type="text" 
            placeholder="Jogos" 
            className="search-input py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-1">Local</label>
          <input 
            type="text" 
            placeholder="Todos" 
            className="search-input py-2"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm text-white mb-1">Data</label>
          <div className="relative">
            <select 
              className="search-input py-2 appearance-none w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option>Qualquer Data</option>
              <option>Hoje</option>
              <option>Amanhã</option>
              <option>Esta Semana</option>
              <option>Este Mês</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
