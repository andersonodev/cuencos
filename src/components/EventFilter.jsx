import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Filter, X, ChevronDown } from 'lucide-react';
import { estadosBrasil } from '../lib/constants';
import '../styles/eventFilter.css';

const EventFilter = ({ onFilterChange, className = '', showResultsInline = false }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    date: '',
    category: ''
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Função para navegar para resultados de busca
  const navigateToSearchResults = () => {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        searchParams.append(key, value.toString().trim());
      }
    });
    
    navigate(`/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const newFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(newFilters);
  };
  
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    
    const newFilters = {
      ...filters,
      [name]: value
    };
    
    setFilters(newFilters);
  };
  
  // Função para aplicar filtros ao pressionar Enter na busca
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('EventFilter: Enter pressionado, navegando para resultados');
      navigateToSearchResults();
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('EventFilter: Submit com filtros:', filters);
    navigateToSearchResults();
  };
  
  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      location: '',
      date: '',
      category: ''
    };
    
    setFilters(clearedFilters);
  };
  
  const dateOptions = [
    { value: '', label: 'Qualquer Data' },
    { value: 'today', label: 'Hoje' },
    { value: 'tomorrow', label: 'Amanhã' },
    { value: 'this-week', label: isMobile ? 'Esta Sem.' : 'Esta Semana' },
    { value: 'weekend', label: isMobile ? 'Fim Sem.' : 'Fim de Semana' },
    { value: 'this-month', label: isMobile ? 'Este Mês' : 'Este Mês' },
    { value: 'next-month', label: isMobile ? 'Próx. Mês' : 'Próximo Mês' }
  ];
  
  const categoryOptions = [
    { value: '', label: isMobile ? 'Todas' : 'Todas Categorias' },
    { value: 'festa', label: 'Festas' },
    { value: 'academico', label: 'Acadêmico' },
    { value: 'esporte', label: 'Esportivo' },
    { value: 'show', label: 'Shows' },
    { value: 'cultural', label: 'Cultural' }
  ];

  return (
    <div className={`event-filter-container ${className} ${isExpanded ? 'expanded' : ''}`}>
      <div className="filter-backdrop"></div>
      <div className="event-filter-content">
        <form onSubmit={handleSubmit} className="filter-form">
          {/* Barra de pesquisa principal */}
          <div className="filter-search-container">
            <div className="search-input-wrapper">
              <div className="search-icon-wrapper">
                <Search className="search-icon" size={isMobile ? 16 : 18} />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                onKeyPress={handleSearchKeyPress}
                placeholder={isMobile ? "Buscar eventos" : "Buscar eventos"}
                className="search-input"
              />
              {filters.search && (
                <button 
                  type="button" 
                  onClick={() => {
                    const newFilters = { ...filters, search: '' };
                    setFilters(newFilters);
                  }}
                  className="clear-input-button"
                  aria-label="Limpar busca"
                >
                  <X size={isMobile ? 12 : 14} />
                </button>
              )}
            </div>
            
            <button type="button" className="filter-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
              <Filter size={isMobile ? 14 : 16} />
              {!isMobile && (
                <span className="hidden sm:inline">{isExpanded ? 'Menos Filtros' : 'Mais Filtros'}</span>
              )}
              <span className="sm:hidden">{isExpanded ? 'Menos' : 'Filtros'}</span>
              <ChevronDown size={isMobile ? 12 : 14} className={`toggle-icon ${isExpanded ? 'rotate' : ''}`} />
            </button>
          </div>
          
          {/* Filtros expandidos */}
          <div className={`expanded-filters ${isExpanded ? 'show' : ''}`}>
            <div className="filter-group location-filter">
              <div className="filter-label">
                <MapPin size={isMobile ? 16 : 18} />
                <span>Local</span>
              </div>
              <div className="select-wrapper">
                <select 
                  name="location"
                  value={filters.location}
                  onChange={handleSelectChange}
                  className="filter-select"
                >
                  <option value="">Todo o Brasil</option>
                  {estadosBrasil.map(estado => (
                    <option key={estado.sigla} value={estado.sigla}>
                      {isMobile ? estado.sigla : estado.nome}
                    </option>
                  ))}
                </select>
                <ChevronDown size={isMobile ? 14 : 16} className="select-icon" />
              </div>
            </div>
            
            <div className="filter-group date-filter">
              <div className="filter-label">
                <Calendar size={isMobile ? 16 : 18} />
                <span>Data</span>
              </div>
              <div className="select-wrapper">
                <select 
                  name="date"
                  value={filters.date}
                  onChange={handleSelectChange}
                  className="filter-select"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={isMobile ? 14 : 16} className="select-icon" />
              </div>
            </div>
            
            <div className="filter-group category-filter">
              <div className="filter-label">
                <span>Categoria</span>
              </div>
              <div className="select-wrapper">
                <select 
                  name="category"
                  value={filters.category}
                  onChange={handleSelectChange}
                  className="filter-select"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={isMobile ? 14 : 16} className="select-icon" />
              </div>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className={`filter-actions ${isExpanded ? 'show' : ''}`}>
            <button type="button" onClick={clearFilters} className="clear-filter-btn">
              Limpar
            </button>
            <button type="submit" className="apply-filter-btn">
              <span>Buscar</span>
              <Search size={isMobile ? 14 : 16} className="btn-icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFilter;
