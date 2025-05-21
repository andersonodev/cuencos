import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { CalendarDays, Share2, Download, PlusCircle, BarChart, Layers, ChevronDown } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader';
import Footer from '../components/Footer';
import { getEvents } from '../lib/events';
import { toast } from '../components/ui/use-toast';
import dashboardData from '../data/dashboardData.json';
import '../styles/dashboard.css';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const { visitasAbril, distribuicaoReceita, vendasAbril, eventosPopulares } = dashboardData;

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
    labels: visitasAbril.labels,
    datasets: [
      {
        label: 'Visitas',
        data: visitasAbril.dados,
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
      tooltip: {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        displayColors: false,
      }
    },
  };

  // Dados para o gráfico de pizza - Distribuição de receita
  const pieChartData = {
    labels: distribuicaoReceita.labels,
    datasets: [
      {
        data: distribuicaoReceita.dados,
        backgroundColor: distribuicaoReceita.cores,
        borderColor: distribuicaoReceita.corBorda,
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
          padding: 20
        },
      },
      tooltip: {
        backgroundColor: 'rgba(20, 20, 20, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    },
  };

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
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
          
          {/* Resumo de vendas */}
          <div className="sales-summary">
            <div className="summary-card total-sales">
              <div className="summary-icon">₪</div>
              <div className="summary-content">
                <h3>Total de vendas</h3>
                <div className="summary-value">R${vendasAbril.total.toLocaleString('pt-BR')}</div>
                <div className="summary-trend positive">
                  <span>+{vendasAbril.crescimento}%</span> desde o mês passado
                </div>
              </div>
            </div>
            
            <div className="summary-card products-sold">
              <div className="summary-icon">✓</div>
              <div className="summary-content">
                <h3>Produtos vendidos</h3>
                <div className="summary-value">{vendasAbril.produtosVendidos}</div>
                <div className="summary-trend positive">
                  <span>+{vendasAbril.crescimentoProdutos}%</span> desde o mês passado
                </div>
              </div>
            </div>
            
            <div className="summary-card new-customers">
              <div className="summary-icon">♦</div>
              <div className="summary-content">
                <h3>Novos clientes</h3>
                <div className="summary-value">{vendasAbril.novosClientes}</div>
                <div className={`summary-trend ${vendasAbril.crescimentoClientes > 0 ? 'positive' : 'negative'}`}>
                  <span>{vendasAbril.crescimentoClientes > 0 ? '+' : ''}{vendasAbril.crescimentoClientes}%</span> desde o mês passado
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
              {eventosPopulares.map((event, index) => (
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
              <Pie data={pieChartData} options={pieChartOptions} />
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
