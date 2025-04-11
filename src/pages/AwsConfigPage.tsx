
import React from 'react';
import Layout from '../components/layout/Layout';
import AwsConfigGuide from '../components/home/AwsConfigGuide';

const AwsConfigPage = () => {
  return (
    <Layout>
      <div className="py-8">
        <AwsConfigGuide />
      </div>
    </Layout>
  );
};

export default AwsConfigPage;
