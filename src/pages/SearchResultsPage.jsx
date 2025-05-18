
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { searchEvents } from '../lib/events';

const SearchResultsPage = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    date: [],
    category: []
  });
  const [activeFilters, setActiveFilters] = useState({
    date: [],
    category: []
  });
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchTerm = query.get('q') || '';
    const searchLocation = query.get('location') || '';
    const searchDate = query.get('date') || '';
    
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      const searchResults = searchEvents(searchTerm, searchLocation, searchDate);
      setResults(searchResults);
      setLoading(false);
      
      // Set up filter options based on results
      setFilterOptions({
        date: [
          { id: 'today', label: 'Hoje' },
          { id: 'tomorrow', label: 'Amanhã' },
          { id: 'this-week', label: 'Esta Semana' },
          { id: 'weekend', label: 'Fim de Semana' },
          { id: 'this-month', label: 'Esse mês' },
          { id: 'next-month', label: 'A partir do próximo mês' },
        ],
        category: [
          { id: 'sports', label: 'Atléticas' },
          { id: 'bars', label: 'Bares e Baladas' },
          { id: 'events', label: 'Produtoras de Evento' },
          { id: 'championships', label: 'Campeonatos' },
          { id: 'academic', label: 'Comunidade Acadêmica' },
        ]
      });
    }, 500);
  }, [location.search]);
  
  const toggleFilter = (type, id) => {
    setActiveFilters(prev => {
      const current = [...prev[type]];
      const index = current.indexOf(id);
      
      if (index >= 0) {
        current.splice(index, 1);
      } else {
        current.push(id);
      }
      
      return {
        ...prev,
        [type]: current
      };
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-cuencos-black py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-cuencos-purple mb-8">Resultados da busca por "Jogos"</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters */}
            <div className="w-full md:w-64 shrink-0">
              <h2 className="text-xl font-semibold text-white mb-4">Filtros</h2>
              
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Data</h3>
                <ul className="space-y-2">
                  {filterOptions.date.map(option => (
                    <li key={option.id}>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={activeFilters.date.includes(option.id)}
                          onChange={() => toggleFilter('date', option.id)}
                          className="mr-2"
                        />
                        <span className="text-white">{option.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-white font-medium mb-2">Categoria</h3>
                <ul className="space-y-2">
                  {filterOptions.category.map(option => (
                    <li key={option.id}>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={activeFilters.category.includes(option.id)}
                          onChange={() => toggleFilter('category', option.id)}
                          className="mr-2"
                        />
                        <span className="text-white">{option.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Results */}
            <div className="flex-grow">
              <div className="flex justify-end mb-4">
                <div className="relative inline-block">
                  <select className="appearance-none bg-white bg-opacity-10 border border-gray-600 rounded-full py-1 pl-4 pr-8 text-white">
                    <option>Relevância</option>
                    <option>Data: Mais Próxima</option>
                    <option>Preço: Menor</option>
                    <option>Preço: Maior</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-cuencos-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.length > 0 ? (
                    results.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <h3 className="text-xl text-white mb-2">Nenhum resultado encontrado</h3>
                      <p className="text-gray-400">Tente ajustar seus filtros ou buscar por outro termo.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;
