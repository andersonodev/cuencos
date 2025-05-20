
// User authentication with localStorage
import { setItem, getItem, removeItem } from './storage';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'current_user';

// Initialize default users if none exist
const initializeUsers = () => {
  try {
    const existingUsers = getItem(USERS_KEY);
    
    if (!existingUsers) {
      const defaultUsers = [
        {
          id: "johnfrontend@gmail.com",
          email: "johnfrontend@gmail.com",
          name: "John Frontend",
          password: "admin123", // In a real app, this would be hashed
          phone: "+5521999887766",
        },
        {
          id: "fronted",
          email: "fronted@example.com",
          name: "Frontend Developer",
          password: "admin123", // In a real app, this would be hashed
          phone: "+5521888776655",
        },
        {
          id: "organizador@cuencos.com",
          email: "organizador@cuencos.com",
          name: "Organizador Cuencos",
          password: "admin123", // In a real app, this would be hashed
          phone: "+5521777665544",
          tipo: "organizador"
        }
      ];
      
      setItem(USERS_KEY, defaultUsers);
    }
  } catch (error) {
    console.error("Erro ao inicializar usuários:", error);
  }
};

// Initialize users when this module loads
initializeUsers();

// Get all users
export const getUsers = () => {
  return getItem(USERS_KEY) || [];
};

// Login user
export const loginUser = (email, password) => {
  try {
    const users = getUsers();
    // Check if the input is email or username
    const user = users.find(u => 
      (u.email === email || u.id === email) && u.password === password
    );
    
    if (user) {
      // Store only non-sensitive user data in session
      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        tipo: user.tipo || 'cliente' // Default to 'cliente' if tipo is not set
      };
      
      setItem(CURRENT_USER_KEY, sessionUser);
      return sessionUser;
    }
    return null;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return null;
  }
};

// Get current logged in user
export const getCurrentUser = () => {
  return getItem(CURRENT_USER_KEY);
};

// Logout current user
export const logoutUser = () => {
  try {
    removeItem(CURRENT_USER_KEY);
    return true;
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return false;
  }
};

// Register a new user
export const registerUser = (userData) => {
  try {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      return { success: false, message: "E-mail já cadastrado" };
    }
    
    // Create new user
    const newUser = {
      id: userData.email, // Using email as ID
      ...userData,
      tipo: userData.tipo || 'cliente', // Default to 'cliente' if tipo is not set
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    users.push(newUser);
    setItem(USERS_KEY, users);
    
    // Return success but don't include password in the response
    const { password, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return { success: false, message: "Erro ao registrar usuário" };
  }
};

// Update a user's information
export const updateUser = (userId, updatedData) => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return { success: false, message: "Usuário não encontrado" };
    }
    
    // Update user data while preserving the id
    users[userIndex] = {
      ...users[userIndex],
      ...updatedData,
      id: userId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    
    setItem(USERS_KEY, users);
    
    // Also update current user session if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedSessionUser = {
        ...currentUser,
        ...updatedData,
        id: userId
      };
      setItem(CURRENT_USER_KEY, updatedSessionUser);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return { success: false, message: "Erro ao atualizar usuário" };
  }
};

// Check if user is an organizer
export const isOrganizer = (userId) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    return user && user.tipo === 'organizador';
  } catch (error) {
    console.error("Erro ao verificar tipo de usuário:", error);
    return false;
  }
};
