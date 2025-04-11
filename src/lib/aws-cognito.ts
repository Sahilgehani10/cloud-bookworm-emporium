
// Simulated AWS Cognito service for user authentication
export const cognitoService = {
  // Current user state
  currentUser: null,
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    // In a real implementation, this would check the Cognito user session
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  
  // Sign in (simulated)
  signIn: async (username: string, password: string): Promise<boolean> => {
    // In a real implementation, this would use the Cognito SDK to authenticate
    
    // For demo purposes, accept any non-empty username/password
    if (username && password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      return true;
    }
    
    return false;
  },
  
  // Sign out (simulated)
  signOut: async (): Promise<void> => {
    // In a real implementation, this would use the Cognito SDK to sign out
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  },
  
  // Get current username (simulated)
  getUsername: (): string | null => {
    return localStorage.getItem('username');
  }
};
