
import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturedBooks from '../components/home/FeaturedBooks';
import CategorySection from '../components/home/CategorySection';
import AwsSection from '../components/home/AwsSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedBooks />
      <CategorySection />
      <AwsSection />
    </Layout>
  );
};

export default Index;
