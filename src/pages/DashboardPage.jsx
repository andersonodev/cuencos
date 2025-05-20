
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Share2, Download, PlusCircle, ChevronDown } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import Footer from '../components/Footer';
import '../styles/dashboard.css';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../context/AuthContext';
import { getEvents, getPopularEvents } from '../lib/events';

// Importação condicional para evitar erros caso as bibliotecas não estejam instaladas
let Bar, Line, Pie, ChartJS, registerables;
try {
  // Tente importar react-chartjs-2 e chart.js
  const chartImport = require('react-chartjs-2');
  const chartJsImport = require('chart.js');
  
  Bar = chartImport.Bar;
  Line = chartImport.Line;
  Pie = chartImport.Pie;
  ChartJS = chartJsImport.Chart;
  registerables = chartJsImport.registerables;
  
  // Registrar componentes do Chart.js
  ChartJS.register(...registerables);
} catch (error) {
  console.warn('Bibliotecas de gráficos não estão instaladas. Execute: npm install chart.js react-chartjs-2');
  
  // Versões mock dos componentes para evitar erros
  Bar = ({ data, options }) => <div className="chart-placeholder">Gráfico de Barras (Biblioteca não instalada)</div>;
  Line = ({ data, options }) => <div className="chart-placeholder">Gráfico de Linha (Biblioteca não instalada)</div>;
  Pie = ({ data, options }) => <div className="chart-placeholder">Gráfico de Pizza (Biblioteca não instalada)</div>;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isOrganizer } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [chartsLoaded, setChartsLoaded] = useState(!!Bar && !!Line && !!Pie);
  const [events, setEvents] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const { toast } = useToast();

  // Verificar se o usuário está logado e é um organizador
  useEffect(() => {
    if (!user) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!isOrganizer()) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Essa área é exclusiva para organizadores",
      });
      navigate('/');
      return;
    }

    // Carregar dados dos eventos
    const loadEvents = () => {
      try {
        const allEvents = getEvents();
        const activeEvents = allEvents.filter(event => !event.isDraft);
        const popular = getPopularEvents(4);
        
        setEvents(activeEvents);
        
        // Formatar dados para os gráficos de popularidade
        const formattedPopular = popular.map((event, index) => ({
          nome: event.title,
          popularidade: event.salesCount || Math.floor(Math.random() * 50) + 20
        }));
        
        setPopularEvents(formattedPopular);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [user, isOrganizer, navigate, toast]);

  // Dados para o gráfico de linha - Visitas
  const lineChartData = {
    labels: Array.from({ length: 30 }, (_, i) => `${String(i + 1).padStart(2, '0')}`),
    datasets: [
      {
        label: 'Visitas',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 400) + 100).map((val, i) => i === 14 ? 500 : val), // Pico no dia 15
        fill: true,
        backgroundColor: 'rgba(184, 74, 247, 0.2)',
        borderColor: '#b84af7',
        tension: 0.4,
        pointBackgroundColor: '#b84af7',
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#888',
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#888',
        },
        max: 600,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Dados para o gráfico de pizza - Distribuição de receita
  const pieChartData = {
    labels: events.slice(0, 2).map(event => event.title),
    datasets: [
      {
        data: [92, 8],
        backgroundColor: [
          'rgba(184, 74, 247, 0.8)',
          'rgba(74, 144, 247, 0.8)',
        ],
        borderColor: [
          'rgba(184, 74, 247, 1)',
          'rgba(74, 144, 247, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Função para criar novo evento (redireciona para a página de gerenciamento)
  const handleCreateEvent = () => {
    navigate('/dashboard/management');
  };

  // Função para quando o usuário muda o período selecionado
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    
    toast({
      title: "Período alterado",
      description: `Visualizando dados por ${period}`,
    });
  };

  // Função para exportar dados
  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão exportados em CSV",
    });
    
    // Mock de exportação
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: "Dados exportados com sucesso!",
        variant: "success",
      });
    }, 1500);
  };

  // Função para compartilhar dados
  const handleShareData = () => {
    toast({
      title: "Compartilhamento",
      description: "Função de compartilhamento em desenvolvimento",
    });
  };

  if (isLoading) {
    return <div className="dashboard-loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader user={user} />
      
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Dashboard</h1>
        </div>

        {/* Filtro de eventos */}
        <div className="dashboard-filters">
          <div className="filter-dropdown">
            <span>Todos os Eventos</span>
            <ChevronDown size={16} />
          </div>
          
          <div className="period-filters">
            <button 
              className={selectedPeriod === 'day' ? 'active' : ''} 
              onClick={() => handlePeriodChange('day')}
            >
              Dia
            </button>
            <button 
              className={selectedPeriod === 'week' ? 'active' : ''} 
              onClick={() => handlePeriodChange('week')}
            >
              Semana
            </button>
            <button 
              className={selectedPeriod === 'month' ? 'active' : ''} 
              onClick={() => handlePeriodChange('month')}
            >
              Mês
            </button>
            <button 
              className={selectedPeriod === 'semester' ? 'active' : ''} 
              onClick={() => handlePeriodChange('semester')}
            >
              Semestre
            </button>
            <button className="select-date">
              <CalendarDays size={16} />
              Selecionar
            </button>
          </div>
        </div>
        
        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Gráfico de visitas */}
          <div className="dashboard-card visits-chart">
            <div className="card-header">
              <h2>Visitas à página - Abril</h2>
              <div className="card-actions">
                <button className="action-button" onClick={handleExportData}>
                  <Download size={16} />
                  Exportar
                </button>
                <button className="action-button" onClick={handleShareData}>
                  <Share2 size={16} />
                  Compartilhar
                </button>
              </div>
            </div>
            <div className="chart-container">
              {chartsLoaded ? (
                <Line data={lineChartData} options={lineChartOptions} />
              ) : (
                <div className="chart-placeholder">
                  <p>Bibliotecas de gráficos não instaladas</p>
                  <p>Execute: npm install chart.js react-chartjs-2</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Resumo de vendas */}
          <div className="sales-summary">
            <div className="summary-card total-sales">
              <div className="summary-icon">₪</div>
              <div className="summary-content">
                <h3>Total de vendas</h3>
                <div className="summary-value">R$13.960</div>
                <div className="summary-trend positive">
                  <span>+10%</span> desde o mês passado
                </div>
              </div>
            </div>
            
            <div className="summary-card products-sold">
              <div className="summary-icon">✓</div>
              <div className="summary-content">
                <h3>Produtos vendidos</h3>
                <div className="summary-value">98</div>
                <div className="summary-trend positive">
                  <span>+2%</span> desde o mês passado
                </div>
              </div>
            </div>
            
            <div className="summary-card new-customers">
              <div className="summary-icon">♦</div>
              <div className="summary-content">
                <h3>Novos clientes</h3>
                <div className="summary-value">12</div>
                <div className="summary-trend negative">
                  <span>-5%</span> desde o mês passado
                </div>
              </div>
            </div>
          </div>
          
          {/* Produtos mais vendidos */}
          <div className="dashboard-card popular-products">
            <div className="card-header">
              <h2>Produtos mais vendidos</h2>
              <div className="card-actions">
                <button className="action-button" onClick={handleCreateEvent}>
                  <PlusCircle size={16} />
                  Novo produto
                </button>
              </div>
            </div>
            
            <div className="popular-products-list">
              {popularEvents.map((event, index) => (
                <div key={index} className="product-item">
                  <div className="product-name">{event.nome}</div>
                  <div className="product-bar-container">
                    <div 
                      className="product-bar" 
                      style={{ width: `${event.popularidade}%` }}
                    ></div>
                  </div>
                  <div className="product-percentage">{event.popularidade}%</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Distribuição da receita */}
          <div className="dashboard-card revenue-distribution">
            <div className="card-header">
              <h2>Distribuição da receita (Abril)</h2>
            </div>
            <div className="pie-chart-container">
              {chartsLoaded ? (
                <Pie data={pieChartData} options={pieChartOptions} />
              ) : (
                <div className="chart-placeholder">
                  <p>Bibliotecas de gráficos não instaladas</p>
                  <p>Execute: npm install chart.js react-chartjs-2</p>
                </div>
              )}
            </div>
            <div className="total-percentage">Total 100%</div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
