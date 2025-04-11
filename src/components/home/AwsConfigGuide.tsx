
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { isAwsConfigured } from '@/lib/aws-config';

const AwsConfigGuide = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const isConfigured = isAwsConfigured();

  const copyEnvTemplate = () => {
    const template = `# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your-access-key
VITE_AWS_SECRET_ACCESS_KEY=your-secret-key

# S3 Configuration
VITE_S3_BUCKET_NAME=your-bucket-name

# Cognito Configuration
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id

# API Gateway (optional)
VITE_API_GATEWAY_ENDPOINT=https://your-api-gateway-url.amazonaws.com/prod
`;
    
    navigator.clipboard.writeText(template);
    toast({
      title: "Template copied to clipboard",
      description: "Paste it into your .env.local file and fill in your AWS credentials."
    });
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-serif text-bookstore-primary mb-4">AWS Configuration Guide</h2>
        
        {isConfigured ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
            <p className="font-medium">AWS credentials are configured! 🎉</p>
            <p className="text-sm">Your app is now using AWS services.</p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded mb-6">
            <p className="font-medium">AWS credentials not found</p>
            <p className="text-sm">The app is currently using mock data. Follow the guide below to connect to AWS.</p>
          </div>
        )}
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="s3">S3</TabsTrigger>
            <TabsTrigger value="dynamodb">DynamoDB</TabsTrigger>
            <TabsTrigger value="cognito">Cognito</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <h3 className="text-xl font-medium mb-4">Getting Started with AWS</h3>
            <ol className="list-decimal ml-6 space-y-4 mb-6">
              <li>
                <p><strong>Create an AWS Account</strong></p>
                <p className="text-gray-600">If you don't have an AWS account, create one at <a href="https://aws.amazon.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">aws.amazon.com</a></p>
              </li>
              <li>
                <p><strong>Create IAM User with Access Keys</strong></p>
                <p className="text-gray-600">In the AWS Management Console, navigate to IAM and create a new user with programmatic access.</p>
              </li>
              <li>
                <p><strong>Set Environment Variables</strong></p>
                <p className="text-gray-600">Create a <code>.env.local</code> file in your project root and add your AWS credentials:</p>
                <div className="bg-gray-100 p-3 rounded mt-2 mb-2">
                  <pre><code>VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=your-access-key-id
VITE_AWS_SECRET_ACCESS_KEY=your-secret-access-key</code></pre>
                </div>
                <Button 
                  onClick={copyEnvTemplate}
                  size="sm"
                  variant="outline"
                  className="mt-1"
                >
                  Copy Full Template
                </Button>
              </li>
              <li>
                <p><strong>Restart Your Development Server</strong></p>
                <p className="text-gray-600">After setting environment variables, restart your development server to apply the changes.</p>
              </li>
            </ol>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Need more help?</h4>
                <p className="text-sm text-gray-600">See the detailed guides for each AWS service.</p>
              </div>
              <Button onClick={() => setActiveTab('s3')}>Continue to S3 Setup →</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="s3">
            <h3 className="text-xl font-medium mb-4">Setting up Amazon S3</h3>
            <ol className="list-decimal ml-6 space-y-4 mb-6">
              <li>
                <p><strong>Create S3 Bucket</strong></p>
                <p className="text-gray-600">In the AWS Management Console, navigate to S3 and create a new bucket to store book cover images.</p>
              </li>
              <li>
                <p><strong>Configure Bucket Permissions</strong></p>
                <p className="text-gray-600">For a public bookstore, you might want to make your images publicly readable:</p>
                <div className="bg-gray-100 p-3 rounded mt-2">
                  <pre><code>{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}`}</code></pre>
                </div>
              </li>
              <li>
                <p><strong>Set S3 Bucket Name in Environment Variables</strong></p>
                <div className="bg-gray-100 p-3 rounded mt-2">
                  <pre><code>VITE_S3_BUCKET_NAME=your-bucket-name</code></pre>
                </div>
              </li>
              <li>
                <p><strong>Upload Book Cover Images</strong></p>
                <p className="text-gray-600">Upload your book cover images to the bucket. Make sure the image keys match what you're using in your DynamoDB book records.</p>
              </li>
            </ol>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <Button onClick={() => setActiveTab('overview')} variant="outline">← Back to Overview</Button>
              <Button onClick={() => setActiveTab('dynamodb')}>Continue to DynamoDB Setup →</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="dynamodb">
            <h3 className="text-xl font-medium mb-4">Setting up Amazon DynamoDB</h3>
            <ol className="list-decimal ml-6 space-y-4 mb-6">
              <li>
                <p><strong>Create Books Table</strong></p>
                <p className="text-gray-600">In the AWS Management Console, navigate to DynamoDB and create a new table:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li><strong>Table name:</strong> Books</li>
                  <li><strong>Partition key:</strong> id (String)</li>
                </ul>
              </li>
              <li>
                <p><strong>Create Global Secondary Index for Categories</strong></p>
                <p className="text-gray-600">Create a GSI to efficiently query books by category:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li><strong>Index name:</strong> CategoryIndex</li>
                  <li><strong>Partition key:</strong> category (String)</li>
                </ul>
              </li>
              <li>
                <p><strong>Add Book Data</strong></p>
                <p className="text-gray-600">You can use the mock data from the app as a starting point. Add books to your table following this schema:</p>
                <div className="bg-gray-100 p-3 rounded mt-2 max-h-48 overflow-y-auto">
                  <pre><code>{`{
  "id": "1",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A novel of the Jazz Age...",
  "price": 12.99,
  "rating": 4.5,
  "imageKey": "great-gatsby.jpg",
  "category": "fiction",
  "inStock": true,
  "featured": true,
  "tags": ["classic", "literary fiction", "american"]
}`}</code></pre>
                </div>
              </li>
            </ol>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <Button onClick={() => setActiveTab('s3')} variant="outline">← Back to S3</Button>
              <Button onClick={() => setActiveTab('cognito')}>Continue to Cognito Setup →</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="cognito">
            <h3 className="text-xl font-medium mb-4">Setting up Amazon Cognito</h3>
            <ol className="list-decimal ml-6 space-y-4 mb-6">
              <li>
                <p><strong>Create User Pool</strong></p>
                <p className="text-gray-600">In the AWS Management Console, navigate to Cognito and create a new User Pool:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Choose <strong>Cognito user pool</strong> as the provider type</li>
                  <li>Configure sign-in options (username, email, etc.)</li>
                  <li>Set password policies and MFA settings as desired</li>
                </ul>
              </li>
              <li>
                <p><strong>Create App Client</strong></p>
                <p className="text-gray-600">Create an app client within your User Pool:</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Select <strong>Public client</strong> for a JavaScript app</li>
                  <li>Enable necessary auth flows (ALLOW_USER_PASSWORD_AUTH)</li>
                </ul>
              </li>
              <li>
                <p><strong>Set Cognito Environment Variables</strong></p>
                <div className="bg-gray-100 p-3 rounded mt-2">
                  <pre><code>VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_CLIENT_ID=your-client-id</code></pre>
                </div>
              </li>
            </ol>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between items-center">
              <Button onClick={() => setActiveTab('dynamodb')} variant="outline">← Back to DynamoDB</Button>
              <Button onClick={() => setActiveTab('overview')} variant="outline">Back to Overview</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default AwsConfigGuide;
