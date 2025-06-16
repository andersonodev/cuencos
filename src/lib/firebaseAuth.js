import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { app } from './firebase';

// Inicializa a autenticação do Firebase
const auth = getAuth(app);

// Provedor para autenticação com Google
const googleProvider = new GoogleAuthProvider();

/**
 * Função para registrar um novo usuário
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @param {string} name - Nome do usuário
 */
export const registerWithEmail = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Atualizar o perfil do usuário com o nome
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao registrar:", error);
    throw error;
  }
};

/**
 * Função para fazer login com email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

/**
 * Função para fazer login com Google
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Erro ao fazer login com Google:", error);
    throw error;
  }
};

/**
 * Função para fazer logout
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw error;
  }
};

/**
 * Função para enviar email de redefinição de senha
 * @param {string} email - Email do usuário
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Erro ao enviar email de redefinição:", error);
    throw error;
  }
};

/**
 * Função para observar mudanças no estado de autenticação
 * @param {function} callback - Função a ser chamada quando o estado de autenticação mudar
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Exporta o objeto de autenticação para uso direto se necessário
export { auth };
