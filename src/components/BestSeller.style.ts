import styled from 'styled-components';

export const BestSellerWrapper = styled.section`
  padding: 60px 0;
  background-color: #fff;

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section-title {
    text-align: center;
    margin-bottom: 40px;
    
    h2 {
      font-size: 2.5rem;
      font-weight: 500;
      color: #333;
      margin-bottom: 16px;
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .product-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      
      .product-image img {
        transform: scale(1.05);
      }
      
      .quick-actions {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .product-image {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }
  }

  .badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: #f8f1f1;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .sale-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #ff6b6b;
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .product-info {
    padding: 16px;
    text-align: center;

    h3 {
      font-size: 1.125rem;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    .price {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      
      .current-price {
        font-size: 1.25rem;
        font-weight: 600;
        color: #333;
      }
      
      .original-price {
        font-size: 1rem;
        color: #999;
        text-decoration: line-through;
      }
    }
  }

  .quick-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    gap: 12px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;

    button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #333;
        border-color: #333;
        color: #fff;
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`; 