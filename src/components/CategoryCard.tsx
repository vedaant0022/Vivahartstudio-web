import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  image: string;
  link: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, image, link }) => {
  return (
    <Link to={link} className="block relative group overflow-hidden rounded-lg">
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 group-hover:bg-opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-semibold tracking-wider">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 