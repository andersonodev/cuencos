
// User authentication with localStorage
const USERS_STORAGE_KEY = 'cuencos_users';
const CURRENT_USER_KEY = 'cuencos_current_user';

// Initialize default users if none exist
const initializeUsers = () => {
  try {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    
    if (!existingUsers) {
      const defaultUsers = [
        {
          id: "johnfrontend@gmail.com",
          email: "johnfrontend@gmail.com",
          name: "John Frontend",
          password: "admin123", // In a real app, this would be hashed
          phone: "+5521999887766",
        }
      ];
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  } catch (error) {
    console.error("Erro ao inicializar usuários:", error);
  }
};

// Get all users
export const getUsers = () => {
  try {
    const usersData = localStorage.getItem(USERS_STORAGE_KEY);
    return usersData ? JSON.parse(usersData) : [];
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    return [];
  }
};

// Login user
export const loginUser = (email, password) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store only non-sensitive user data in session
      const sessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone
      };
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
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
  try {
    const userData = localStorage.getItem(CURRENT_USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error);
    return null;
  }
};

// Logout current user
export const logoutUser = () => {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
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
      ...userData
    };
    
    // Save to localStorage
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
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
      id: userId // Ensure ID doesn't change
    };
    
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    // Also update current user session if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedSessionUser = {
        ...currentUser,
        ...updatedData,
        id: userId
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedSessionUser));
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return { success: false, message: "Erro ao atualizar usuário" };
  }
};

// Initialize users on module import
initializeUsers();
