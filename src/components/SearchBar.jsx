import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar = ({ className, defaultValues = {} }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    q: defaultValues.q || '',
    location: defaultValues.location || '',
    date: defaultValues.date || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Função para navegar para resultados
  const navigateToResults = () => {
    // Construir query params apenas para valores não vazios
    const queryParams = new URLSearchParams();
    
    if (searchParams.q) queryParams.append('q', searchParams.q);
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.date) queryParams.append('date', searchParams.date);
    
    // Navegar para página de busca apenas se tiver pelo menos um parâmetro
    if (queryParams.toString()) {
      navigate(`/search?${queryParams.toString()}`);
    } else if (searchParams.q || searchParams.location || searchParams.date) {
      // Se tem pelo menos um campo preenchido, navegar mesmo sem query params
      navigate('/search');
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigateToResults();
  };
  
  // Função para detectar Enter em qualquer campo
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigateToResults();
    }
  };
  
  return (
    <div className={`purple-search mb-8 shadow-lg ${className || ''}`}>
      <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap">
        <div className="flex items-center border-r border-[#A259FF]/30 px-4 py-3 w-full md:w-1/3 relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-4" />
          <input
            type="text"
            name="q"
            value={searchParams.q}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Buscar eventos"
            className="search-input w-full bg-transparent border-none focus:outline-none text-white pl-8"
          />
        </div>
        
        <div className="flex items-center border-r border-[#A259FF]/30 px-4 py-3 w-full md:w-1/3">
          <input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Local"
            className="search-input w-full bg-transparent border-none focus:outline-none text-white"
          />
        </div>
        
        <div className="flex items-center px-4 py-3 w-full md:w-1/3">
          <select
            name="date"
            value={searchParams.date}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="search-input w-full bg-transparent border-none focus:outline-none text-white appearance-none"
          >
            <option value="" className="bg-zinc-800">Qualquer Data</option>
            <option value="today" className="bg-zinc-800">Hoje</option>
            <option value="week" className="bg-zinc-800">Esta Semana</option>
            <option value="month" className="bg-zinc-800">Este Mês</option>
            <option value="future" className="bg-zinc-800">Meses Futuros</option>
          </select>
        </div>
        
        <button 
          type="submit"
          className="hidden md:flex items-center justify-center bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-3"
        >
          <Search className="h-5 w-5 text-white" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
