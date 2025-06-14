import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import { CategoriesSectionWrapper } from './CategoriesSection.style';

const categories = [
  {
    id: 1,
    title: 'RAKHI COLLECTION',
    image: '/categories/rakhi-collection.jpg',
    link: '/rakhi-collection'
  },
  {
    id: 2,
    title: 'WESTERN EDIT- 2025',
    image: '/categories/western-edit.jpg',
    link: '/western-edit'
  },
  {
    id: 3,
    title: 'MAKE YOUR OWN SET',
    image: '/categories/make-your-own.jpg',
    link: '/make-your-own'
  },
  {
    id: 4,
    title: 'HALDI & MEHNDI SETS',
    image: '/categories/haldi-mehndi.jpg',
    link: '/haldi-mehndi'
  },
  {
    id: 5,
    title: 'FESTIVE HANDBAGS',
    image: '/categories/festive-handbags.jpg',
    link: '/festive-handbags'
  },
  {
    id: 6,
    title: 'BANGLES',
    image: '/categories/bangles.jpg',
    link: '/bangles'
  }
];

const CategoriesSection: React.FC = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/categories');
  };

  return (
    <CategoriesSectionWrapper>
      <div className="container">
        <h2 className="section-title">
          SHOP BY CATEGORIES
        </h2>
        
        <div className="categories-grid">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              title={category.title}
              image={category.image}
              link={category.link}
            />
          ))}
        </div>

        <div className="view-all-btn">
          <button onClick={handleViewAll}>
            VIEW ALL CATEGORIES
          </button>
        </div>
      </div>
    </CategoriesSectionWrapper>
  );
};

export default CategoriesSection; 