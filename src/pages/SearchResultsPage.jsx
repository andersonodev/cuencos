
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModernHeader from '../components/ModernHeader';
import ModernFooter from '../components/ModernFooter';
import SearchFilters from '../components/SearchFilters';
import EventCard from '../components/EventCard';
import { mockEvents } from '../lib/mockEvents';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from 'lucide-react';

const SearchResultsPage = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const searchTerm = query.get('q') || 'Jogos';
    
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setResults(mockEvents);
      setLoading(false);
    }, 500);
  }, [location.search]);

  return (
    <div className="flex flex-col min-h-screen bg-cuencos-black">
      <ModernHeader />
      
      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-cuencos-purple to-cuencos-darkPurple py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl text-white font-bold">
            Resultados da busca por "<span>Jogos</span>"
          </h1>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filters Trigger */}
          <div className="md:hidden mb-4">
            <Sheet>
              <SheetTrigger className="w-full bg-cuencos-gray text-white py-3 flex items-center justify-center gap-2 rounded-md">
                <MenuIcon className="w-5 h-5" />
                <span>Filtros</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0 bg-cuencos-black">
                <SearchFilters />
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-full md:w-64 shrink-0">
            <div className="sticky top-24">
              <SearchFilters />
            </div>
          </div>
          
          {/* Results Area */}
          <div className="flex-grow">
            {/* Sort Dropdown */}
            <div className="flex justify-end mb-6">
              <div className="relative">
                <label className="text-gray-400 mr-2">Organizar por</label>
                <select className="appearance-none bg-gray-800 border border-gray-700 rounded-lg py-2 pl-4 pr-10 text-white">
                  <option>Relevância</option>
                  <option>Data: Mais Próxima</option>
                  <option>Preço: Menor</option>
                  <option>Preço: Maior</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white top-6">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Events Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cuencos-purple"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {results.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <ModernFooter />
    </div>
  );
};

export default SearchResultsPage;
