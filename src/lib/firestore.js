import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { app } from './firebase';

// Inicializa o Firestore
const db = getFirestore(app);

/**
 * Função para obter todos os documentos de uma coleção
 * @param {string} collectionName - Nome da coleção
 * @returns {Promise<Array>} - Array com os documentos encontrados
 */
export const getCollection = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Erro ao obter coleção ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Função para obter um documento específico
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @returns {Promise<Object>} - Documento encontrado
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Erro ao obter documento ${docId} da coleção ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Função para adicionar um documento a uma coleção
 * @param {string} collectionName - Nome da coleção
 * @param {Object} data - Dados do documento
 * @returns {Promise<string>} - ID do documento criado
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Erro ao adicionar documento à coleção ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Função para atualizar um documento
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 * @param {Object} data - Novos dados do documento
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Erro ao atualizar documento ${docId} da coleção ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Função para excluir um documento
 * @param {string} collectionName - Nome da coleção
 * @param {string} docId - ID do documento
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Erro ao excluir documento ${docId} da coleção ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Função para consultar documentos com filtros
 * @param {string} collectionName - Nome da coleção
 * @param {Array} filters - Array de objetos de filtro (campo, operador, value)
 * @param {string} orderByField - Campo para ordenação
 * @param {string} orderDirection - Direção da ordenação ('asc' ou 'desc')
 * @param {number} limitCount - Limite de documentos
 * @returns {Promise<Array>} - Array com os documentos encontrados
 */
export const queryDocuments = async (collectionName, filters = [], orderByField = null, orderDirection = 'asc', limitCount = null) => {
  try {
    let q = collection(db, collectionName);
    
    // Adicionar filtros
    if (filters.length > 0) {
      const constraints = filters.map(filter => where(filter.field, filter.operator, filter.value));
      q = query(q, ...constraints);
    }
    
    // Adicionar ordenação
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    
    // Adicionar limite
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Erro ao consultar coleção ${collectionName}:`, error);
    throw error;
  }
};

export { db };
