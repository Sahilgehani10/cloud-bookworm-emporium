
import React from 'react';
import { Database, HardDrive, Shield, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { isAwsConfigured } from '@/lib/aws-config';

const AwsSection = () => {
  const navigate = useNavigate();
  const isConfigured = isAwsConfigured();

  return (
    <section className="py-16 bg-bookstore-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-medium mb-4">Powered by AWS Cloud</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our online bookstore is built on Amazon Web Services, providing a secure, 
            scalable, and reliable shopping experience.
          </p>
          {!isConfigured && (
            <Button 
              className="mt-4 bg-bookstore-accent hover:bg-bookstore-accent/90 text-black"
              onClick={() => navigate('/aws-config')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure AWS Connection
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* AWS S3 */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-bookstore-accent mb-4">
              <HardDrive className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-serif font-medium mb-2">AWS S3</h3>
            <p className="text-gray-300">
              All our book covers and promotional images are stored in Amazon S3, 
              ensuring fast loading times and high availability.
            </p>
          </div>

          {/* AWS DynamoDB */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-bookstore-accent mb-4">
              <Database className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-serif font-medium mb-2">AWS DynamoDB</h3>
            <p className="text-gray-300">
              Our inventory management system is powered by DynamoDB, 
              providing a fast and scalable database solution for our book catalog.
            </p>
          </div>

          {/* AWS Cognito */}
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-bookstore-accent mb-4">
              <Shield className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-serif font-medium mb-2">AWS Cognito</h3>
            <p className="text-gray-300">
              User authentication and account management are handled by 
              AWS Cognito, ensuring your personal information remains secure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwsSection;
