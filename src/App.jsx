import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from "./components/theme-provider";
import { initializeFromAPI } from './lib/events'; // Corrigida a importação
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importação de todas as páginas
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import TicketSelectionPage from './pages/TicketSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutPage from './pages/LogoutPage';
import AccountPage from './pages/AccountPage';
import ChangeEmailPage from './pages/ChangeEmailPage';
import MyTicketsPage from './pages/MyTicketsPage';
import FavoritesPage from './pages/FavoritesPage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFound from './pages/NotFound';
import DashboardPage from './pages/DashboardPage';
import DashboardManagementPage from './pages/DashboardManagementPage';
import DashboardAccountPage from './pages/DashboardAccountPage';
import DashboardEmailPage from './pages/DashboardEmailPage';
import EventCreationPage from './pages/EventCreationPage';
import ComingSoonPage from './pages/ComingSoonPage';
import OrganizerAccountPage from './pages/OrganizerAccountPage';
import OrganizerChangeEmailPage from './pages/OrganizerChangeEmailPage';

// Importar o utilitário para verificar disponibilidade do localStorage
import { isAvailable } from './lib/storage';

const queryClient = new QueryClient();

function App() {
  // Limpar dados locais que podem interferir com a API
  useEffect(() => {
    // Limpar localStorage de eventos antigos
    localStorage.removeItem('cuencos_events');
    localStorage.removeItem('events');
    console.log('Cache local de eventos limpo - usando apenas API');
  }, []);
  
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');
  
  useEffect(() => {
    // Verificar se o localStorage está disponível
    const checkStorage = () => {
      const available = isAvailable();
      setStorageAvailable(available);
      
      if (!available) {
        console.warn('LocalStorage não está disponível. Algumas funcionalidades podem não funcionar corretamente.');
      }
    };
    
    checkStorage();
  }, []);
  
  useEffect(() => {
    // Inicializar dados de eventos quando o app carregar
    const initializeEvents = async () => {
      try {
        setApiStatus('checking');
        
        // Tentar inicializar com dados da API
        const success = await initializeFromAPI();
        
        if (success) {
          setApiStatus('online');
          console.log('✅ Eventos carregados da API com sucesso');
        } else {
          setApiStatus('offline');
          console.warn('⚠️ Usando dados locais - API indisponível');
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar eventos:', error);
        setApiStatus('offline');
      }
    };
    
    initializeEvents();
    
    // Verificar status da API periodicamente (a cada 30 segundos)
    const healthCheckInterval = setInterval(async () => {
      try {
        const isOnline = await checkAPIStatus();
        setApiStatus(isOnline ? 'online' : 'offline');
      } catch (error) {
        setApiStatus('offline');
      }
    }, 30000);
    
    return () => clearInterval(healthCheckInterval);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <ThemeProvider defaultTheme="dark" storageKey="cuencos-theme">
            {!storageAvailable && (
              <div 
                style={{ 
                  background: '#ff4040', 
                  color: 'white', 
                  textAlign: 'center', 
                  padding: '10px', 
                  fontSize: '14px' 
                }}
              >
                Atenção: O armazenamento local está desativado ou indisponível. 
                Algumas funcionalidades como login e favoritos não irão funcionar corretamente.
              </div>
            )}
            
            {/* Indicador de status da API obrigatório */}
            {apiStatus === 'offline' && (
              <div 
                style={{ 
                  background: '#dc2626', 
                  color: 'white', 
                  textAlign: 'center', 
                  padding: '8px', 
                  fontSize: '12px',
                  position: 'relative'
                }}
              >
                🔴 API offline - Nenhum evento será exibido | 
                <button 
                  onClick={() => window.location.reload()} 
                  style={{
                    marginLeft: '8px',
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Tentar reconectar
                </button>
              </div>
            )}
            
            {apiStatus === 'online' && (
              <div 
                style={{ 
                  background: '#16a34a', 
                  color: 'white', 
                  textAlign: 'center', 
                  padding: '4px', 
                  fontSize: '11px',
                  opacity: 0.9
                }}
              >
                🟢 Conectado à API
              </div>
            )}
            
            <Router>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/events/:id/buy" element={<TicketSelectionPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/email" element={<ChangeEmailPage />} />
                <Route path="/my-tickets" element={<MyTicketsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/management" element={<DashboardManagementPage />} />
                <Route path="/dashboard/account" element={<DashboardAccountPage />} />
                <Route path="/dashboard/email" element={<DashboardEmailPage />} />
                <Route path="/event/:id" element={<EventCreationPage />} />
                <Route path="/coming-soon" element={<ComingSoonPage />} /> {/* Nova rota */}
                
                {/* Rotas para organizador */}
                <Route path="/dashboard/account" element={<OrganizerAccountPage />} />
                <Route path="/dashboard/email" element={<OrganizerChangeEmailPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </ThemeProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
