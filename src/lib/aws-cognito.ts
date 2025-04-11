
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GlobalSignOutCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { awsConfig, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, isAwsConfigured } from './aws-config';

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient(awsConfig);

export const cognitoService = {
  // Current user state
  currentUser: null,
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (isAwsConfigured()) {
      // Check for a valid session token
      const session = localStorage.getItem('awsUserSession');
      if (!session) return false;
      
      try {
        const sessionData = JSON.parse(session);
        // Check if token is expired
        if (sessionData.expiration && new Date(sessionData.expiration) > new Date()) {
          return true;
        } else {
          localStorage.removeItem('awsUserSession');
          return false;
        }
      } catch (e) {
        localStorage.removeItem('awsUserSession');
        return false;
      }
    } else {
      // Fallback to mock authentication when AWS is not configured
      return localStorage.getItem('isAuthenticated') === 'true';
    }
  },
  
  // Sign in
  signIn: async (username: string, password: string): Promise<boolean> => {
    if (isAwsConfigured() && COGNITO_CLIENT_ID) {
      try {
        const command = new InitiateAuthCommand({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: COGNITO_CLIENT_ID,
          AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
          },
        });
        
        const response = await cognitoClient.send(command);
        const authResult = response.AuthenticationResult;
        
        if (authResult && authResult.IdToken) {
          // Store the session
          const sessionData = {
            idToken: authResult.IdToken,
            accessToken: authResult.AccessToken,
            refreshToken: authResult.RefreshToken,
            expiration: new Date(Date.now() + (authResult.ExpiresIn || 3600) * 1000).toISOString(),
            username: username
          };
          
          localStorage.setItem('awsUserSession', JSON.stringify(sessionData));
          localStorage.setItem('username', username);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Cognito sign in error:', error);
        return false;
      }
    } else {
      // Fallback to mock authentication
      if (username && password) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        return true;
      }
      return false;
    }
  },
  
  // Sign up
  signUp: async (username: string, password: string, email: string): Promise<boolean> => {
    if (isAwsConfigured() && COGNITO_CLIENT_ID) {
      try {
        const command = new SignUpCommand({
          ClientId: COGNITO_CLIENT_ID,
          Username: username,
          Password: password,
          UserAttributes: [
            {
              Name: 'email',
              Value: email
            }
          ]
        });
        
        await cognitoClient.send(command);
        return true;
      } catch (error) {
        console.error('Cognito sign up error:', error);
        return false;
      }
    } else {
      // Fallback mock sign up
      return true;
    }
  },
  
  // Confirm sign up (for email verification)
  confirmSignUp: async (username: string, code: string): Promise<boolean> => {
    if (isAwsConfigured() && COGNITO_CLIENT_ID) {
      try {
        const command = new ConfirmSignUpCommand({
          ClientId: COGNITO_CLIENT_ID,
          Username: username,
          ConfirmationCode: code
        });
        
        await cognitoClient.send(command);
        return true;
      } catch (error) {
        console.error('Cognito confirm sign up error:', error);
        return false;
      }
    } else {
      // Fallback mock confirmation
      return true;
    }
  },
  
  // Sign out
  signOut: async (): Promise<void> => {
    if (isAwsConfigured()) {
      const session = localStorage.getItem('awsUserSession');
      if (session) {
        try {
          const sessionData = JSON.parse(session);
          if (sessionData.accessToken) {
            const command = new GlobalSignOutCommand({
              AccessToken: sessionData.accessToken
            });
            await cognitoClient.send(command);
          }
        } catch (error) {
          console.error('Cognito sign out error:', error);
        }
      }
      localStorage.removeItem('awsUserSession');
      localStorage.removeItem('username');
    } else {
      // Fallback mock sign out
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
    }
  },
  
  // Get current username
  getUsername: (): string | null => {
    if (isAwsConfigured()) {
      try {
        const session = localStorage.getItem('awsUserSession');
        if (session) {
          const sessionData = JSON.parse(session);
          return sessionData.username || null;
        }
      } catch (e) {
        return null;
      }
    }
    return localStorage.getItem('username');
  }
};
