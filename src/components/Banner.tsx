import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { baseURL } from '../utils/api';


// Types for banner data
interface BannerImage {
  url: string;
  key: string;
}

interface BannerData {
  _id: string;
  name: string;
  mobileImage: BannerImage;
  websiteImage: BannerImage;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  total: number;
  data: BannerData[];
}

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerData, setBannerData] = useState<BannerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen size is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch banner data from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/api/banners`, {
          headers: {
            'Authorization': 'Bearer your_jwt_token_here' // Replace with actual token
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        
        if (data.status === 'success' && data.data) {
          // Filter only active banners
          const activeBanners = data.data.filter(banner => banner.isActive);
          setBannerData(activeBanners);
        } else {
          throw new Error('Failed to fetch banners');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching banners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length);
  };

  // Auto slide effect
  useEffect(() => {
    if (bannerData.length > 0) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [bannerData.length]);

  // Reset current slide when banner data changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [bannerData]);

  // Get appropriate image URL based on screen size
  const getImageUrl = (banner: BannerData) => {
    return isMobile ? banner.mobileImage.url : banner.websiteImage.url;
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full h-[600px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">Loading banners...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative w-full h-[600px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-red-500">Error loading banners: {error}</div>
      </div>
    );
  }

  // No banners state
  if (bannerData.length === 0) {
    return (
      <div className="relative w-full h-[600px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-gray-500">No banners available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Banner Images */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerData.map((banner) => (
          <div 
            key={banner._id}
            className="min-w-full h-full relative"
          >
            <img 
              src={getImageUrl(banner)}
              alt={banner.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error:', e);
                // Fallback to the other image type if current one fails
                const target = e.target as HTMLImageElement;
                const fallbackUrl = isMobile ? banner.websiteImage.url : banner.mobileImage.url;
                if (target.src !== fallbackUrl) {
                  target.src = fallbackUrl;
                }
              }}
            />
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-transparent bg-opacity-30 flex items-center justify-center">
              {/* You can add banner title or other content here if needed */}
              {/* <div className="text-white text-center">
                <h2 className="text-2xl font-bold">{banner.name}</h2>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if there are multiple banners */}
      {bannerData.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full text-gray-800 transition-all duration-200"
            aria-label="Previous banner"
          >
            <FontAwesomeIcon icon={faChevronLeft} size="lg" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 p-2 rounded-full text-gray-800 transition-all duration-200"
            aria-label="Next banner"
          >
            <FontAwesomeIcon icon={faChevronRight} size="lg" />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if there are multiple banners */}
      {bannerData.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {bannerData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Banner;