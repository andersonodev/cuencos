
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Pie } from 'recharts';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { CalendarDays, Share2, Download, ChevronDown, PlusCircle, BarChart3, ShoppingBag, UserPlus } from 'lucide-react';
import Footer from '../components/Footer';
import DashboardHeader from '../components/DashboardHeader';
import { toast } from '../components/ui/use-toast';
import { Separator } from '../components/ui/separator';
import { getItem, setItem } from '../lib/storage';
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

// Chaves para o localStorage
const STORAGE_KEYS = {
  VISITAS: 'dashboard_visitas',
  PRODUTOS: 'dashboard_produtos',
  VENDAS: 'dashboard_vendas',
  RECEITA: 'dashboard_receita',
};

// Dados mockados para caso não exista no localStorage
const mockData = {
  visitasAbril: {
    labels: [...Array(30).keys()].map(day => String(day + 1).padStart(2, '0')),
    dados: [80, 90, 85, 95, 80, 90, 180, 300, 200, 220, 210, 190, 180, 200, 500, 420, 350, 320, 280, 260, 320, 340, 290, 270, 210, 220, 200, 250, 300, 320]
  },
  distribuicaoReceita: {
    labels: ["Engenharias Paranaense", "PUC IN RIO"],
    dados: [92, 8],
    cores: ["rgba(184, 74, 247, 0.8)", "rgba(74, 144, 247, 0.8)"],
    corBorda: ["rgba(184, 74, 247, 1)", "rgba(74, 144, 247, 1)"]
  },
  vendasAbril: {
    total: 13960,
    crescimento: 10,
    produtosVendidos: 98,
    crescimentoProdutos: 2,
    novosClientes: 12,
    crescimentoClientes: 3
  },
  eventosPopulares: [
    { id: "01", nome: "PUC IN RIO", popularidade: 84 },
    { id: "02", nome: "Engenharias Paranaense 2025", popularidade: 44 }
  ]
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [highlightedDay, setHighlightedDay] = useState(15); // Dia destacado no gráfico

  // Carregar dados do localStorage ou usar mock
  useEffect(() => {
    const loadData = () => {
      try {
        // Tentar obter dados do localStorage
        const visitasData = getItem(STORAGE_KEYS.VISITAS);
        const produtosData = getItem(STORAGE_KEYS.PRODUTOS);
        const vendasData = getItem(STORAGE_KEYS.VENDAS);
        const receitaData = getItem(STORAGE_KEYS.RECEITA);

        // Se todos os dados existirem, usar eles
        if (visitasData && produtosData && vendasData && receitaData) {
          setDashboardData({
            visitasAbril: visitasData,
            eventosPopulares: produtosData,
            vendasAbril: vendasData,
            distribuicaoReceita: receitaData
          });
        } else {
          // Se não existirem, usar dados mockados e salvar no localStorage
          setDashboardData(mockData);
          setItem(STORAGE_KEYS.VISITAS, mockData.visitasAbril);
          setItem(STORAGE_KEYS.PRODUTOS, mockData.eventosPopulares);
          setItem(STORAGE_KEYS.VENDAS, mockData.vendasAbril);
          setItem(STORAGE_KEYS.RECEITA, mockData.distribuicaoReceita);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setDashboardData(mockData);
      }
    };

    loadData();
  }, []);

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
    labels: dashboardData?.visitasAbril.labels || [],
    datasets: [
      {
        label: 'Visitas',
        data: dashboardData?.visitasAbril.dados || [],
        fill: true,
        backgroundColor: 'rgba(180, 62, 255, 0.2)',
        borderColor: '#b43eff',
        tension: 0.4,
        pointBackgroundColor: '#b43eff',
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
          maxTicksLimit: 15,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#888',
          stepSize: 100,
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
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: highlightedDay - 1,
            xMax: highlightedDay - 1,
            borderColor: 'rgba(180, 62, 255, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
          }
        }
      }
    },
  };

  // Dados para o gráfico de pizza - Distribuição de receita
  const pieChartData = {
    labels: dashboardData?.distribuicaoReceita.labels || [],
    datasets: [
      {
        data: dashboardData?.distribuicaoReceita.dados || [],
        backgroundColor: ['rgba(180, 74, 247, 0.8)', 'rgba(200, 200, 255, 0.5)'],
        borderColor: ['rgba(180, 74, 247, 1)', 'rgba(200, 200, 255, 1)'],
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
          padding: 15
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
    toast({
      title: "Período alterado",
      description: `Período alterado para ${period === 'month' ? 'Mês' : period === 'week' ? 'Semana' : period === 'day' ? 'Dia' : 'Semestre'}`,
      variant: "success"
    });
  };

  if (isLoading || !dashboardData) {
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
          
          <div className="chart-actions">
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
        
        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Gráfico de visitas - ocupa span 4 */}
          <div className="dashboard-card visits-chart">
            <div className="card-header">
              <h2>Visitas à página - Abril</h2>
            </div>
            <div className="chart-container">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* Produtos mais vendidos - tabela */}
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
              
              {dashboardData.eventosPopulares.map((event, index) => (
                <div key={index} className="table-row">
                  <div className="col-position">{event.id}</div>
                  <div className="col-name" title={event.nome}>{event.nome}</div>
                  <div className="col-popularity">
                    <div className="progress-container">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${event.popularidade}%`, 
                          backgroundColor: index === 0 ? "#FFA726" : "#4DB5FF" 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="col-sales">
                    <span className="sales-badge">
                      {event.popularidade}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Container para Cards de KPIs e Gráfico de Pizza */}
          <div className="metrics-container">
            {/* Cards de KPIs e Métricas */}
            <div className="dashboard-card sales-summary">
              <div className="card-header">
                <h2>Vendas em Abril</h2>
                <div className="card-subtitle">Resumo de vendas de Abril</div>
              </div>
              
              <div className="metrics-cards">
                <div className="summary-card">
                  <div className="summary-icon" style={{ backgroundColor: "rgba(184, 74, 247, 0.15)" }}>
                    <BarChart3 size={24} />
                  </div>
                  <div className="summary-content">
                    <div className="summary-value">R$ {dashboardData.vendasAbril.total.toLocaleString('pt-BR')}</div>
                    <h3>Venda total</h3>
                    <div className="summary-trend positive">
                      <span>+{dashboardData.vendasAbril.crescimento}% desde o mês anterior</span>
                    </div>
                  </div>
                </div>
                
                <div className="summary-card">
                  <div className="summary-icon" style={{ backgroundColor: "rgba(74, 144, 247, 0.15)" }}>
                    <ShoppingBag size={24} />
                  </div>
                  <div className="summary-content">
                    <div className="summary-value">{dashboardData.vendasAbril.produtosVendidos}</div>
                    <h3>Produtos Vendidos</h3>
                    <div className="summary-trend positive">
                      <span>+{dashboardData.vendasAbril.crescimentoProdutos}% desde ontem</span>
                    </div>
                  </div>
                </div>
                
                <div className="summary-card">
                  <div className="summary-icon" style={{ backgroundColor: "rgba(255, 111, 214, 0.15)" }}>
                    <UserPlus size={24} />
                  </div>
                  <div className="summary-content">
                    <div className="summary-value">{dashboardData.vendasAbril.novosClientes}</div>
                    <h3>Novos clientes</h3>
                    <div className="summary-trend positive">
                      <span>+{dashboardData.vendasAbril.crescimentoClientes}% desde o mês anterior</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Distribuição da receita - gráfico de pizza */}
            <div className="dashboard-card revenue-distribution">
              <div className="card-header">
                <h2>Distribuição da receita</h2>
                <div className="card-subtitle">Abril</div>
              </div>
              <div className="pie-chart-container">
                <Pie data={pieChartData} options={pieChartOptions} />
              </div>
              <div className="total-percentage">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: "rgba(180, 74, 247, 0.8)" }}></span>
                  <span className="legend-label">Engenharias Paranaense: 92%</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: "rgba(200, 200, 255, 0.5)" }}></span>
                  <span className="legend-label">PUC IN RIO: 8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;
