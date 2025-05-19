import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    q: 'Jogos',
    location: 'Todos',
    date: 'Qualquer Data'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/search?${query}`);
  };
  
  return (
    <div className="purple-search mb-8 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap">
        <div className="flex items-center border-r border-[#A259FF]/30 px-4 py-3 w-full md:w-1/3">
          <input
            type="text"
            name="q"
            value={searchParams.q}
            onChange={handleChange}
            placeholder="Search Event"
            className="search-input w-full bg-transparent border-none focus:outline-none text-white"
          />
        </div>
        
        <div className="flex items-center border-r border-[#A259FF]/30 px-4 py-3 w-full md:w-1/3">
          <input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleChange}
            placeholder="Local"
            className="search-input w-full bg-transparent border-none focus:outline-none text-white"
          />
        </div>
        
        <div className="flex items-center px-4 py-3 w-full md:w-1/3">
          <input
            type="text"
            name="date"
            value={searchParams.date}
            onChange={handleChange}
            placeholder="Data"
            className="search-input w-full bg-transparent border-none focus:outline-none text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
