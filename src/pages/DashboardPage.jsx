import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { CalendarDays, Share2, Download, ChevronDown, PlusCircle } from 'lucide-react';
import Footer from '../components/Footer';
import DashboardHeader from '../components/DashboardHeader';
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

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    toast.success(`Período alterado para ${period === 'month' ? 'Mês' : period === 'week' ? 'Semana' : 'Dia'}`);
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
          {/* Gráfico de visitas - ocupa span 3 */}
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

          {/* Card de resumo de vendas - ocupa span 1 */}
          <div className="dashboard-card sales-summary">
            <div className="card-header">
              <h2>Vendas em Abril</h2>
              <p className="card-subtitle">Resumo de vendas de Abril</p>
            </div>
            
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-icon">₪</div>
                <div className="summary-content">
                  <div className="summary-label">Valor total</div>
                  <div className="summary-value">R${vendasAbril.total.toLocaleString('pt-BR')}</div>
                  <div className="summary-trend positive">
                    <span>+{vendasAbril.crescimento}% desde o mês anterior</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Produtos mais vendidos - ocupa span 2 */}
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
            
            <div className="products-table">
              <div className="table-header">
                <div className="col-position">#</div>
                <div className="col-name">Nome</div>
                <div className="col-popularity">Popularidade</div>
                <div className="col-sales">Vendas</div>
              </div>
              
              {eventosPopulares.map((event, index) => (
                <div key={index} className="table-row">
                  <div className="col-position">{index + 1}</div>
                  <div className="col-name" title={event.nome}>{event.nome}</div>
                  <div className="col-popularity">
                    <div className="progress-container">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${event.popularidade}%`, 
                          backgroundColor: event.id === "01" ? "#F0C05A" : "#4DB5FF" 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-sales">
                    <span 
                      className="sales-badge"
                      style={{ 
                        backgroundColor: event.id === "01" ? "rgba(240, 192, 90, 0.2)" : "rgba(77, 181, 255, 0.2)",
                        color: event.id === "01" ? "#F0C05A" : "#4DB5FF"
                      }}
                    >
                      {event.popularidade}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Distribuição da receita - ocupa span 2 */}
          <div className="dashboard-card revenue-distribution">
            <div className="card-header">
              <h2>Distribuição da receita - Abril</h2>
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
