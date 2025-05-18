import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    q: '',
    location: '',
    date: ''
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
    <div className="bg-cuencos-gray rounded-lg p-4 shadow-lg mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <div className="flex-grow">
          <input
            type="text"
            name="q"
            value={searchParams.q}
            onChange={handleChange}
            placeholder="Procurar eventos..."
            className="w-full bg-cuencos-black text-white p-3 rounded-md"
          />
        </div>
        <div className="md:w-1/4">
          <input
            type="text"
            name="location"
            value={searchParams.location}
            onChange={handleChange}
            placeholder="Local"
            className="w-full bg-cuencos-black text-white p-3 rounded-md"
          />
        </div>
        <div className="md:w-1/4">
          <input
            type="text"
            name="date"
            value={searchParams.date}
            onChange={handleChange}
            placeholder="Data"
            className="w-full bg-cuencos-black text-white p-3 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-cuencos-purple hover:bg-cuencos-darkPurple text-white p-3 rounded-md"
        >
          Buscar
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
