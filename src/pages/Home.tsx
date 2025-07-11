import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import CategoriesSection from '../components/CategoriesSection';
import BestSeller from '../components/BestSeller';
import Footer from '../components/Footer';
import TestimonialsSection from '../components/testimonials-section';
import FullScreenLoader from '../components/Fullscreenloder';
const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);
  if (isLoading) {
    return <FullScreenLoader message="Loading your experience..." isVisible={isLoading} />;
  }
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Banner />
      {/* <BrandSlider /> */}
      <CategoriesSection  />
      <BestSeller />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Home; 