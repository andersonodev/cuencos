import React, { useState } from 'react';
import { Search, MapPin, Calendar, Filter, X, ChevronDown } from 'lucide-react';
import { estadosBrasil } from '../lib/constants';
import '../styles/eventFilter.css';

const EventFilter = ({ onFilterChange, className = '' }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    date: '',
    category: ''
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };
  
  const clearFilters = () => {
    const emptyFilters = {
      search: '',
      location: '',
      date: '',
      category: ''
    };
    
    setFilters(emptyFilters);
    
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };
  
  const dateOptions = [
    { value: '', label: 'Qualquer Data' },
    { value: 'today', label: 'Hoje' },
    { value: 'tomorrow', label: 'Amanhã' },
    { value: 'this-week', label: 'Esta Semana' },
    { value: 'weekend', label: 'Fim de Semana' },
    { value: 'this-month', label: 'Este Mês' },
    { value: 'next-month', label: 'Próximo Mês' }
  ];
  
  const categoryOptions = [
    { value: '', label: 'Todas Categorias' },
    { value: 'athletics', label: 'Atléticas' },
    { value: 'party', label: 'Festas & Shows' },
    { value: 'academic', label: 'Acadêmico' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Esportivo' }
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
                <Search className="search-icon" size={20} />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                placeholder="Buscar eventos"
                className="search-input"
              />
              {filters.search && (
                <button 
                  type="button" 
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="clear-input-button"
                  aria-label="Limpar busca"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <button type="button" className="filter-toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
              <Filter size={18} />
              <span>{isExpanded ? 'Menos Filtros' : 'Mais Filtros'}</span>
              <ChevronDown size={16} className={`toggle-icon ${isExpanded ? 'rotate' : ''}`} />
            </button>
          </div>
          
          {/* Filtros expandidos */}
          <div className={`expanded-filters ${isExpanded ? 'show' : ''}`}>
            <div className="filter-group location-filter">
              <div className="filter-label">
                <MapPin size={18} />
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
                      {estado.nome}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>
            
            <div className="filter-group date-filter">
              <div className="filter-label">
                <Calendar size={18} />
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
                <ChevronDown size={16} className="select-icon" />
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
                <ChevronDown size={16} className="select-icon" />
              </div>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className={`filter-actions ${isExpanded ? 'show' : ''}`}>
            <button type="button" onClick={clearFilters} className="clear-filter-btn">
              Limpar Filtros
            </button>
            <button type="submit" className="apply-filter-btn">
              <span>Aplicar Filtros</span>
              <Search size={16} className="btn-icon" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFilter;
