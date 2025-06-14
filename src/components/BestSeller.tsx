import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BestSellerWrapper } from './BestSeller.style';

interface Product {
  id: number;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  badge: string;
  link: string;
}

const bestSellerProducts: Product[] = [
  {
    id: 1,
    title: 'Big Sis 3D Heart Rakhi',
    image: '/products/big-sis-rakhi.jpg',
    currentPrice: 399,
    originalPrice: 499,
    discount: 20,
    badge: 'Edit 2025',
    link: '/product/big-sis-rakhi'
  },
  {
    id: 2,
    title: 'Little Sis 3D Heart Rakhi',
    image: '/products/little-sis-rakhi.jpg',
    currentPrice: 399,
    originalPrice: 499,
    discount: 20,
    badge: 'Edit 2025',
    link: '/product/little-sis-rakhi'
  },
  {
    id: 3,
    title: 'Bhabhi Meri Hoor Wargi Lumba Rakhi',
    image: '/products/bhabhi-rakhi.jpg',
    currentPrice: 899,
    originalPrice: 1099,
    discount: 18,
    badge: 'Edit 2025',
    link: '/product/bhabhi-rakhi'
  },
  {
    id: 4,
    title: 'My First Baby Rakhi',
    image: '/products/baby-rakhi.jpg',
    currentPrice: 399,
    originalPrice: 499,
    discount: 20,
    badge: 'Edit 2025',
    link: '/product/baby-rakhi'
  }
];

const BestSeller: React.FC = () => {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <BestSellerWrapper>
      <div className="container">
        <div className="section-title">
          <h2>BEST SELLING RAKHIS</h2>
        </div>

        <div className="products-grid">
          {bestSellerProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link to={product.link}>
                <div className="product-image">
                  <img src={product.image} alt={product.title} />
                  <span className="badge">{product.badge}</span>
                  <span className="sale-badge">{`Sale ${product.discount}% off`}</span>
                </div>

                <div className="product-info">
                  <h3>{product.title}</h3>
                  <div className="price">
                    <span className="current-price">₹{product.currentPrice}</span>
                    <span className="original-price">₹{product.originalPrice}</span>
                  </div>
                </div>
              </Link>

              {hoveredProduct === product.id && (
                <div className="quick-actions">
                  <button title="Quick View">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button title="Add to Cart">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                    </svg>
                  </button>
                  <button title="Add to Wishlist">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BestSellerWrapper>
  );
};

export default BestSeller; 