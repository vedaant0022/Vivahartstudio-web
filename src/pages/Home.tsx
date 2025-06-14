import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import BrandSlider from '../components/BrandSlider';
import CategoriesSection from '../components/CategoriesSection';
import BestSeller from '../components/BestSeller';
import Footer from '../components/Footer';
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Banner />
      <BrandSlider />
      <CategoriesSection />
      <BestSeller />
      <Footer />
      {/* Additional content can be added here */}
    </div>
  );
};

export default Home; 