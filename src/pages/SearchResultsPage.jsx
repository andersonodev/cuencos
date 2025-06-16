import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';
import SearchFilters from '../components/SearchFilters';
import { filterEvents } from '../lib/events';
import { ArrowLeft } from 'lucide-react';
import '../styles/search-results.css';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const initialFilters = {
    q: searchParams.get('q') || '',
    search: searchParams.get('search') || searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    date: searchParams.get('date') || '',
    category: searchParams.get('category') || '',
  };
  
  const [filters, setFilters] = useState(initialFilters);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carregar eventos baseado nos filtros
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      
      try {
        console.log('SearchResultsPage: Aplicando filtros:', filters);
        
        // Usar a função filterEvents da lib/events
        const filteredEvents = await filterEvents(filters);
        
        console.log('SearchResultsPage: Eventos encontrados:', filteredEvents.length);
        setEvents(filteredEvents || []);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [filters]);
  
  // Atualizar filtros quando os parâmetros de URL mudam
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {
      q: params.get('q') || '',
      search: params.get('search') || params.get('q') || '',
      location: params.get('location') || '',
      date: params.get('date') || '',
      category: params.get('category') || '',
    };
    
    setFilters(newFilters);
  }, [location.search]);
  
  // Handler para mudanças no filtro - ADICIONADO
  const handleFilterChange = (newFilters) => {
    console.log('SearchResultsPage: Recebendo novos filtros:', newFilters);
    
    // Atualizar a URL com os novos filtros
    const searchParams = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        // Usar 'q' para busca em vez de 'search'
        const paramKey = key === 'search' ? 'q' : key;
        searchParams.append(paramKey, value.toString().trim());
      }
    });
    
    // Navegar para a nova URL com os filtros
    navigate(`/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, { replace: true });
  };
  
  // Aplicar filtros adicionais
  const applyDateFilter = (dateFilter) => {
    const newFilters = { ...filters, date: dateFilter };
    handleFilterChange(newFilters);
  };
  
  // Aplicar filtros de categoria
  const applyCategoryFilter = (category) => {
    const newFilters = { ...filters, category: category };
    handleFilterChange(newFilters);
  };
  
  // Gerar título da busca
  const getSearchTitle = () => {
    if (filters.q || filters.search) {
      return `Resultados para "${filters.q || filters.search}"`;
    }
    
    const appliedFilters = [];
    if (filters.location) appliedFilters.push(`Local: ${filters.location}`);
    if (filters.category) appliedFilters.push(`Categoria: ${filters.category}`);
    if (filters.date) appliedFilters.push(`Data: ${filters.date}`);
    
    if (appliedFilters.length > 0) {
      return `Eventos filtrados (${appliedFilters.join(', ')})`;
    }
    
    return "Todos os eventos";
  };
  
  return (
    <div className="min-h-screen bg-black search-results-page">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex flex-col">
        {/* Barra de navegação/voltar com maior destaque e garantindo posicionamento no topo */}
        <div className="back-navigation">
          <Link to="/" className="flex items-center text-white hover:text-gray-300 text-base md:text-lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar à página inicial
          </Link>
        </div>
        
        {/* Barra de pesquisa */}
        <div className="search-filter-container">
          <EventFilter 
            onFilterChange={handleFilterChange}
            showResultsInline={false}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 search-results-content">
          {/* Sidebar com filtros */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <SearchFilters 
              selectedDate={filters.date}
              selectedCategory={filters.category}
              onDateFilterChange={applyDateFilter}
              onCategoryFilterChange={applyCategoryFilter}
            />
          </aside>
          
          {/* Resultados da busca */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-white mb-4">
              {getSearchTitle()}
            </h1>
            
            {/* Informações dos filtros aplicados */}
            <div className="mb-4">
              {filters.location && (
                <p className="text-gray-400 text-sm">
                  📍 Local: {filters.location}
                </p>
              )}
              {filters.category && (
                <p className="text-gray-400 text-sm">
                  🏷️ Categoria: {filters.category}
                </p>
              )}
              {filters.date && (
                <p className="text-gray-400 text-sm">
                  📅 Data: {filters.date}
                </p>
              )}
            </div>
            
            <p className="text-gray-400 mb-6 text-sm">
              {isLoading 
                ? 'Buscando eventos...' 
                : `${events.length} evento${events.length !== 1 ? 's' : ''} encontrado${events.length !== 1 ? 's' : ''}`
              }
            </p>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-lg">
                <p className="text-2xl text-white mb-4">Nenhum evento encontrado</p>
                <p className="text-gray-400 mb-6">
                  Tente ajustar seus filtros de busca ou explorar todas as categorias.
                </p>
                <Link 
                  to="/"
                  className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md inline-block"
                >
                  Ver todos os eventos
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResultsPage;