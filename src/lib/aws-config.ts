
// AWS Configuration with environment variables support
// In production, you should use environment variables for all credentials

// Region configuration
export const AWS_REGION = import.meta.env.VITE_AWS_REGION || "us-east-1";

// S3 configuration
export const S3_BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME || "bookstore-images";

// API Gateway endpoint (if you're using API Gateway)
export const API_ENDPOINT = import.meta.env.VITE_API_GATEWAY_ENDPOINT || 
  "https://your-api-gateway-url.amazonaws.com/prod";

// AWS SDK configuration object
export const awsConfig = {
  region: AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || "",
  },
};

// Function to check if AWS credentials are configured
export const isAwsConfigured = (): boolean => {
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
  
  return !!(accessKeyId && secretAccessKey);
};

// Cognito User Pool configuration
export const COGNITO_USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || "";
export const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || "";
