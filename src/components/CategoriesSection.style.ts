import styled from 'styled-components';

export const CategoriesSectionWrapper = styled.section`
  padding: 80px 0;
  background-color: #fff;

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 500;
    text-align: center;
    margin-bottom: 3rem;
    letter-spacing: 0.1em;
    color: #333;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background-color: #333;
    }
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2rem;
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .view-all-btn {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
    
    button {
      padding: 12px 30px;
      background-color: #333;
      color: white;
      border: none;
      font-size: 1rem;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #555;
        transform: translateY(-2px);
      }
    }
  }
`; 