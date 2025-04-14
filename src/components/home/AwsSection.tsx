
import React from 'react';
import { Database, HardDrive, Shield, Settings, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { isAwsConfigured } from '@/lib/aws-config';
import { toast } from '@/components/ui/use-toast';

const AwsSection = () => {
  const navigate = useNavigate();
  const isConfigured = isAwsConfigured();

  const handleConfigCheck = () => {
    if (isConfigured) {
      toast({
        title: "AWS Connection Status",
        description: "AWS is properly configured and connected!",
        variant: "default",
      });
    } else {
      toast({
        title: "AWS Connection Status",
        description: "AWS is not configured. Please set up your AWS credentials.",
        variant: "destructive",
      });
      navigate('/aws-config');
    }
  };

  return (
    <section className="py-16 bg-bookstore-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-medium mb-4">AWS Cloud Infrastructure</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-lg">Connection Status:</span>
            {isConfigured ? (
              <span className="flex items-center gap-1 text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400">
                <XCircle className="h-5 w-5" />
                Not Connected
              </span>
            )}
          </div>
          <Button 
            onClick={handleConfigCheck}
            className="mb-4 bg-bookstore-accent hover:bg-bookstore-accent/90 text-black"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isConfigured ? "Check AWS Connection" : "Configure AWS"}
          </Button>
          {!isConfigured && (
            <p className="text-yellow-300 text-sm mb-4">
              Currently using mock data. Configure AWS to use real cloud services.
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* AWS S3 Status Card */}
          <div className={`bg-white/10 backdrop-blur-sm p-6 rounded-lg ${isConfigured ? 'border-green-400' : 'border-red-400'} border`}>
            <div className="text-bookstore-accent mb-4">
              <HardDrive className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-serif font-medium mb-2">AWS S3</h3>
            <p className="text-gray-300">
              {isConfigured 
                ? "Book covers and images are being served from Amazon S3."
                : "Using placeholder images. Configure S3 for real book covers."}
            </p>
          </div>

          {/* AWS DynamoDB Status Card */}
          <div className={`bg-white/10 backdrop-blur-sm p-6 rounded-lg ${isConfigured ? 'border-green-400' : 'border-red-400'} border`}>
            <div className="text-bookstore-accent mb-4">
              <Database className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-serif font-medium mb-2">AWS DynamoDB</h3>
            <p className="text-gray-300">
              {isConfigured 
                ? "Book inventory is being managed through DynamoDB."
                : "Using mock data. Configure DynamoDB for real inventory."}
            </p>
          </div>

          {/* AWS Cognito Status Card */}
          <div className={`bg-white/10 backdrop-blur-sm p-6 rounded-lg ${isConfigured ? 'border-green-400' : 'border-red-400'} border`}>
            <div className="text-bookstore-accent mb-4">
              <Shield className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-serif font-medium mb-2">AWS Cognito</h3>
            <p className="text-gray-300">
              {isConfigured 
                ? "User authentication is handled by AWS Cognito."
                : "Using mock auth. Configure Cognito for real authentication."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwsSection;
