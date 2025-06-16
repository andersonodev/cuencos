import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from './firebase';

// Inicializa o Storage do Firebase
const storage = getStorage(app);

/**
 * Função para fazer upload de arquivo para o Storage do Firebase
 * @param {File} file - Arquivo a ser enviado
 * @param {string} path - Caminho onde o arquivo será armazenado no Storage
 * @returns {Promise<string>} - URL do arquivo enviado
 */
export const uploadFile = async (file, path) => {
  try {
    // Criar referência ao arquivo no Storage
    const fileRef = ref(storage, path);
    
    // Fazer upload do arquivo
    const snapshot = await uploadBytes(fileRef, file);
    
    // Obter URL do arquivo
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Erro ao fazer upload de arquivo:", error);
    throw error;
  }
};

/**
 * Função para fazer upload de uma imagem de evento
 * @param {File} imageFile - Imagem a ser enviada
 * @param {string} eventId - ID do evento
 * @returns {Promise<string>} - URL da imagem enviada
 */
export const uploadEventImage = async (imageFile, eventId) => {
  const extension = imageFile.name.split('.').pop();
  const path = `events/${eventId}/cover.${extension}`;
  return await uploadFile(imageFile, path);
};

/**
 * Função para fazer upload de um avatar de usuário
 * @param {File} imageFile - Imagem a ser enviada
 * @param {string} userId - ID do usuário
 * @returns {Promise<string>} - URL da imagem enviada
 */
export const uploadUserAvatar = async (imageFile, userId) => {
  const extension = imageFile.name.split('.').pop();
  const path = `users/${userId}/avatar.${extension}`;
  return await uploadFile(imageFile, path);
};

/**
 * Função para excluir um arquivo do Storage
 * @param {string} fileURL - URL completa do arquivo a ser excluído
 */
export const deleteFile = async (fileURL) => {
  try {
    // Extrair o caminho do arquivo da URL
    const fileRef = ref(storage, fileURL);
    
    // Excluir o arquivo
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Erro ao excluir arquivo:", error);
    throw error;
  }
};

export { storage };
