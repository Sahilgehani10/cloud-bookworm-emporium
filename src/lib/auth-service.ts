
import { User } from '@/types/user';

const ADMIN_USERS = ['admin'];

// Simple authentication service that replaces AWS Cognito
export const authService = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  
  // Sign in
  signIn: async (username: string, password: string): Promise<boolean> => {
    if (username && password) {
      const isAdmin = ADMIN_USERS.includes(username);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      localStorage.setItem('isAdmin', isAdmin.toString());
      return true;
    }
    return false;
  },
  
  // Sign out
  signOut: async (): Promise<void> => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
  },
  
  // Get current user
  getCurrentUser: (): User | null => {
    if (!authService.isAuthenticated()) {
      return null;
    }
    
    const username = localStorage.getItem('username');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!username) return null;
    
    return {
      username,
      isAdmin
    };
  },
  
  // Check if current user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return !!user && user.isAdmin;
  },
  
  // Get current username
  getUsername: (): string | null => {
    return localStorage.getItem('username');
  }
};
