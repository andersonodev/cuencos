import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Share2, Download, PlusCircle, BarChart, Layers, ChevronDown } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import Footer from '../components/Footer';
import '../styles/dashboard.css';

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
  const [user, setUser] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [chartsLoaded, setChartsLoaded] = useState(!!Bar && !!Line && !!Pie);

  // Verificar se o usuário está logado e é um organizador
  useEffect(() => {
    try {
      const loggedUser = JSON.parse(localStorage.getItem('usuarioLogado'));
      
      if (!loggedUser) {
        navigate('/login');
        return;
      }

      if (loggedUser.tipo !== 'organizador') {
        navigate('/');
        return;
      }

      setUser(loggedUser);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      navigate('/login');
    }
  }, [navigate]);

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
    labels: ['Engenharias Paranaense', 'PUC IN RIO'],
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

  // Dados para o gráfico de barras horizontais - Produtos mais vendidos
  const popularEvents = [
    { nome: "PUC IN RIO", popularidade: 84 },
    { nome: "Engenharias Paranaense 2025", popularidade: 44 },
    { nome: "Festa Junina Universitária", popularidade: 32 },
    { nome: "Calourada 2025.1", popularidade: 28 }
  ];

  if (isLoading) {
    return <div className="dashboard-loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader user={user} />
      
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Bem-vindo ao Dashboard, {user.nome}!</h1>
          <p>Aqui você gerencia todos os seus eventos.</p>
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
              onClick={() => setSelectedPeriod('day')}
            >
              Dia
            </button>
            <button 
              className={selectedPeriod === 'week' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('week')}
            >
              Semana
            </button>
            <button 
              className={selectedPeriod === 'month' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('month')}
            >
              Mês
            </button>
            <button 
              className={selectedPeriod === 'semester' ? 'active' : ''} 
              onClick={() => setSelectedPeriod('semester')}
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
                <button className="action-button">
                  <Download size={16} />
                  Exportar
                </button>
                <button className="action-button">
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
                <button className="action-button">
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
