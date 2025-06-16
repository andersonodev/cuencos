import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { app } from './firebase';

// Inicializa o Analytics do Firebase
const analytics = getAnalytics(app);

/**
 * Função para registrar um evento personalizado no Analytics
 * @param {string} eventName - Nome do evento
 * @param {Object} params - Parâmetros do evento
 */
export const trackEvent = (eventName, params = {}) => {
  try {
    logEvent(analytics, eventName, params);
  } catch (error) {
    console.error("Erro ao registrar evento no Analytics:", error);
  }
};

/**
 * Função para definir o ID do usuário no Analytics
 * @param {string} userId - ID do usuário
 */
export const setAnalyticsUserId = (userId) => {
  try {
    setUserId(analytics, userId);
  } catch (error) {
    console.error("Erro ao definir ID do usuário no Analytics:", error);
  }
};

/**
 * Função para definir propriedades do usuário no Analytics
 * @param {Object} properties - Propriedades do usuário
 */
export const setAnalyticsUserProperties = (properties) => {
  try {
    setUserProperties(analytics, properties);
  } catch (error) {
    console.error("Erro ao definir propriedades do usuário no Analytics:", error);
  }
};

// Eventos comuns para tracking
export const EVENTS = {
  LOGIN: 'login',
  SIGNUP: 'sign_up',
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  PURCHASE: 'purchase',
  SEARCH: 'search',
  VIEW_SEARCH_RESULTS: 'view_search_results',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  SHARE: 'share',
  VIEW_CATEGORY: 'view_item_category',
  SELECT_CONTENT: 'select_content',
  SCREEN_VIEW: 'screen_view'
};

export { analytics };
