import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import banner1 from '../assets/image/banner1.png';
import banner2 from '../assets/image/banner2.png'; 
import banner3 from '../assets/image/banner3.png';

const bannerData = [
  {
    id: 1,
    image: banner1,
    title: 'Rakhi Edit 2025',
    subtitle: 'EARLY BIRD SALE - UPTO 40% OFF',
    buttonText: 'NOW LIVE'
  },
  {
    id: 2,
    image: banner2,
    title: 'New Potli Collection',
    subtitle: 'Exclusive Handcrafted Designs',
    buttonText: 'SHOP NOW'
  },
  {
    id: 3,
    image: banner3,
    title: 'Festival Special',
    subtitle: 'Traditional Handicrafts',
    buttonText: 'EXPLORE'
  }
];

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Auto slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Banner Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerData.map((banner) => (
          <div 
            key={banner.id}
            className="min-w-full h-full relative"
          >
            <img 
              src={banner.image} 
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-transparent bg-opacity-30 flex items-center justify-center">

            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full text-gray-800"
      >
        <FontAwesomeIcon icon={faChevronLeft} size="lg" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full text-gray-800"
      >
        <FontAwesomeIcon icon={faChevronRight} size="lg" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner; 