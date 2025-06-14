import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faMagnifyingGlass, faCartShopping, faUser, faArrowRight, faBars} from '@fortawesome/free-solid-svg-icons';
import { CiFacebook } from "react-icons/ci";
import { FaPinterest } from "react-icons/fa";
import { CiInstagram } from "react-icons/ci";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Mobile Header */}
      <nav className="lg:hidden">
        <div className="flex justify-between items-center px-4 py-4">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-2xl"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          
          <Link to="/" className="text-2xl font-bold text-purple-700">
            TONOTO
          </Link>

          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
            <FontAwesomeIcon icon={faCartShopping} className="text-xl" />
          </div>
        </div>

        {/* Mobile Menu with Header */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-transparent transform transition-transform duration-300 z-50">
            <div className="absolute inset-y-0 left-0 w-[400px]">
              {/* Menu Header */}
              <div className="bg-white px-6 py-4 flex justify-between items-center">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              {/* Menu Content */}
              <div className="h-full bg-[#F3EDF4] p-6 pt-4">
                <div className="flex flex-col space-y-6 text-gray-800 text-xl">
                  <Link to="/rakhi-2025">Rakhi 2025</Link>
                  <Link to="/make-your-own">Make your Own Set</Link>
                  <Link to="/western-accessories">Western Accessories</Link>
                  <Link to="/haldi-mehndi">Haldi & Mehndi Sets</Link>
                  <div className="flex justify-between items-center">
                    <Link to="/jewellery">Shop Jewellery by Category</Link>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  <div className="flex justify-between items-center">
                    <Link to="/handbags">Handbags</Link>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                  <div className="flex justify-between items-center">
                    <Link to="/info">Info</Link>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                </div>

                <div className="absolute bottom-8 left-6 right-6">
                  <div className="flex flex-col space-y-4">
                    <Link to="/login" className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faUser} />
                      <span>Log in / Register</span>
                    </Link>
                    <Link to="/track-order" className="flex items-center space-x-2">
                      <span>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                      </span>
                      <span>Track Your Order</span>
                    </Link>
                    <div className="flex space-x-4 mt-4">
                      <Link to="/facebook">
                        <span className="text-2xl">
                          <CiFacebook />
                        </span>
                      </Link>
                      <Link to="/pinterest">
                        <span className="text-2xl">
                          <FaPinterest />
                        </span>
                      </Link>
                      <Link to="/instagram">
                        <span className="text-2xl">
                          <CiInstagram />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Header */}
      <nav className="hidden lg:block container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/rakhi-2025" className="text-gray-800 hover:text-gray-700 hover:underline">Rakhi 2025</Link>
            <Link to="/jewellery" className="text-gray-800 hover:text-gray-700 hover:underline">Jewellery</Link>
            <Link to="/shop-by-category" className="text-gray-800 hover:text-gray-700 hover:underline">Shop by Category</Link>
            <Link to="/handbags" className="text-gray-800 hover:text-gray-700 hover:underline">Handbags</Link>
          </div>
          
          <Link to="/" className="text-3xl font-bold text-purple-700 ml-[-100px]">
            TONOTO
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/make-your-own" className="text-gray-800 hover:text-gray-700 hover:underline">Make Your Own Set</Link>
            <Link to="/info" className="text-gray-800 hover:text-gray-700 hover:underline">Info</Link>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl cursor-pointer" />
            <FontAwesomeIcon icon={faUser} className="text-xl cursor-pointer" />
            <FontAwesomeIcon icon={faCartShopping} className="text-xl cursor-pointer" />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;