import React from 'react';
import BrandSliderStyleWrapper from "./BrandSlider.style";

const brands = [
  { id: 1, name: 'Local Samosa', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 2, name: 'Book My Wed', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 3, name: 'Whats Hot', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 4, name: 'Weddings Plz', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 5, name: 'Wedding Affair', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 6, name: 'TOI', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  // Duplicate for smooth scrolling
  { id: 7, name: 'Local Samosa', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 8, name: 'Book My Wed', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 9, name: 'Whats Hot', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 10, name: 'Weddings Plz', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 11, name: 'Wedding Affair', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' },
  { id: 12, name: 'TOI', link: 'https://www.tonoto.in/cdn/shop/files/book_my_wed.png?v=1748608779&width=160' }
];

const BrandSlider: React.FC<{ titleClass?: string; sliderClass?: string }> = ({ 
  titleClass = "", 
  sliderClass = "" 
}) => {
  return (
    <BrandSliderStyleWrapper className="brands-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className={`brands-section-title ${titleClass}`}>
              <h2 style={{marginLeft: '200px'}}>FEATURED IN</h2>
            </div>
            <div className={`brands-slider ${sliderClass}`}>
              <div className="brands-slider-container">
                {brands.map((brand) => (
                  <div key={brand.id} className="slider-item">
                    <img src={brand.link} alt={brand.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrandSliderStyleWrapper>
  );
};

export default BrandSlider; 