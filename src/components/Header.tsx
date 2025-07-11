"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';

import { Check, Minus, Plus, ShoppingCart, X, Trash2 } from "lucide-react";
import { toast } from 'react-toastify';
import useAuthStore, { selectIsAuthenticated, selectUser, selectLogout } from '../stores/useAuthStore';
import logo from '../assets/image/logo.png';
import { Button } from './ui/button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}


interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: true,
  });
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Use exported selectors
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore(selectUser);
  const logout = useAuthStore(selectLogout);

  // Load cart items and default address on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated && localStorage.getItem('token')) {
        try {
          const response = await fetch('https://vivahartstudio-backend.onrender.com/api/users/cart-users', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          if (data.status === 'success' && data.data[0]?.cart) {
            setCartItems(
              data.data[0].cart.map((item: any) => ({
                id: item.product._id,
                name: item.product.name,
                price: Number(item.product.sellingPrice),
                quantity: item.quantity,
                image: item.product.images[0]?.url || '/placeholder.svg?height=100&width=100',
              }))
            );
            // Set default address
            const defaultAddr = data.data[0].addresses?.find((addr: Address) => addr.isDefault);
            if (defaultAddr) {
              setDefaultAddress(defaultAddr);
              setAddressForm(defaultAddr);
            }
          }
        } catch (err) {
          console.error('Error fetching cart:', err);
          toast.error('Failed to load cart');
        }
      } else {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };
    fetchCart();
  }, [isAuthenticated]);

  // Save cart to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle address form input changes
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open address form
  const openAddressForm = () => {
    setIsAddressFormOpen(true);
    // Prepopulate form with defaultAddress if available
    if (defaultAddress) {
      setAddressForm(defaultAddress);
    }
  };

  // Save address locally and close form
  const saveAddress = () => {
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.postalCode || !addressForm.country) {
      toast.error('Please fill in all address fields');
      return;
    }
    setDefaultAddress(addressForm);
    setIsAddressFormOpen(false);
    toast.success('Address saved successfully');
  };

  // Cancel address form
  const cancelAddressForm = () => {
    setIsAddressFormOpen(false);
    setAddressForm(defaultAddress || { street: '', city: '', state: '', postalCode: '', country: '', isDefault: true });
  };

  // Add item to cart


  // Update quantity of an item
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    if (isAuthenticated && localStorage.getItem('token')) {
      try {
        await fetch('https://vivahartstudio-backend.onrender.com/api/users/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ productId: id, quantity: quantity }),
        });
        setCartItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
        toast.success('Cart updated');
      } catch (err) {
        console.error('Error updating cart quantity:', err);
        toast.error('Error updating cart');
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      toast.success('Cart updated');
    }
  };

  // Remove an item from the cart
  const removeItem = async (id: string) => {
    if (isAuthenticated && localStorage.getItem('token')) {
      try {
        await fetch('https://vivahartstudio-backend.onrender.com/api/users/cart/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ productId: id, quantity: 0 }),
        });
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        toast.success('Item removed from cart');
      } catch (err) {
        console.error('Error removing item from cart:', err);
        toast.error('Error removing item');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Item removed from cart');
    }
  };

  // Clear cart after successful order
  const clearCart = async () => {
    if (isAuthenticated && localStorage.getItem('token')) {
      try {
        for (const item of cartItems) {
          await fetch('https://vivahartstudio-backend.onrender.com/api/users/cart/remove', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ productId: item.id, quantity: 0 }),
          });
        }
        setCartItems([]);
        localStorage.removeItem('cartItems');
        toast.success('Cart cleared');
      } catch (err) {
        console.error('Error clearing cart:', err);
        toast.error('Error clearing cart');
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('cartItems');
      toast.success('Cart cleared');
    }
  };

  // Handle checkout with Razorpay
  const handleCheckout = async () => {
    if (!isAuthenticated || !localStorage.getItem('token')) {
      toast.error('Please log in to proceed with checkout');
      navigate('/authpage');
      return;
    }

    if (!defaultAddress) {
      toast.error('Please add a shipping address');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const response = await fetch('https://vivahartstudio-backend.onrender.com/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            street: defaultAddress.street,
            city: defaultAddress.city,
            state: defaultAddress.state,
            postalCode: defaultAddress.postalCode,
            country: defaultAddress.country,
          },
          paymentMethod: 'Razorpay',
        }),
      });

      const data = await response.json();
      if (data.message === 'Order created, proceed to payment') {
        const { razorpayOrderId, order, transactionId } = data;

        // Initialize Razorpay
        const options = {
          key: 'rzp_test_gygBXbq4b4mzVe',
          amount: order.totalAmount * 100, // Razorpay expects amount in paise
          currency: 'INR',
          name: 'Your Store Name',
          description: `Order Payment #${order._id}`,
          order_id: razorpayOrderId,
          handler:  async () => {
            // No verification API; rely on backend webhook
            await clearCart();
            toast.success('Payment successful! Order placed.');
            navigate('/order-confirmation', { state: { orderId: order._id, transactionId } });
            },
          prefill: {
            name: `${user?.firstName} ${user?.lastName}`,
            email: user?.email,
            contact:'',
          },
          theme: {
            color: '#800080', // Purple theme
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
        razorpay.on('payment.failed', function (response: any) {
          toast.error(`Payment failed: ${response.error.description || 'Please try again.'}`);
          console.error('Payment failed:', response.error);
        });
      } else {
        toast.error('Failed to create order');
      }
    } catch (err) {
      console.error('Error during checkout:', err);
      toast.error('Error during checkout');
    }
  };

  // Handle click outside of profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
    localStorage.removeItem('token'); // Clear token on logout
  }, [logout, navigate]);

  const handleAuthClick = useCallback(() => {
    if (isAuthenticated) {
      setIsProfileOpen((prev) => !prev);
    } else {
      navigate('/authpage');
    }
  }, [isAuthenticated, navigate]);

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Mobile Header */}
      <nav className="lg:hidden">
        <div className="flex justify-between items-center px-4 py-4">
<div className="flex items-center space-x-4">
    {/* <FontAwesomeIcon icon={faBars} className="text-xl" /> */}
</div>
          <Link to="/" className="text-2xl font-bold text-purple-700">
            <img src={logo} alt="logo"  className="w-50 h-17" />
          </Link>

          <div className="flex items-center space-x-4">
            {/* <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" /> */}
            {isAuthenticated && (
              <>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faCartShopping}
                    className="text-xl cursor-pointer"
                    onClick={() => setIsCartOpen(true)}
                  />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-xl cursor-pointer"
                  onClick={handleAuthClick}
                />
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu with Header */}

      </nav>

      {/* Desktop Header */}
      <nav className="hidden lg:block container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            {isAuthenticated && (
              <>
                {/* <Link to="/rakhi-2025" className="text-gray-800 hover:text-gray-700 hover:underline">
                  Rakhi 2025
                </Link>
                <Link to="/jewellery" className="text-gray-800 hover:text-gray-700 hover:underline">
                  Jewellery
                </Link>
                <Link to="/shop-by-category" className="text-gray-800 hover:text-gray-700 hover:underline">
                  Shop by Category
                </Link>
                <Link to="/handbags" className="text-gray-800 hover:text-gray-700 hover:underline">
                  Handbags
                </Link> */}
              </>
            )}
          </div>

          <Link to={isAuthenticated ? "/" : "/"} className="text-3xl font-bold text-purple-700 ml-[100px]">
            <img src={logo} alt="logo" width={240} height={60} className="w-60 h-17" />
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthenticated && (
              <>
                {/* <Link to="/make-your-own" className="text-gray-800 hover:text-gray-700 hover:underline">
                  Make Your Own Set
                </Link>
                <Link to="/info" className="text-gray-800 hover:text-gray-700 hover:underline">
                  Info
                </Link> */}
              </>
            )}
            {/* <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl cursor-pointer" /> */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-xl cursor-pointer"
                  onClick={handleAuthClick}
                />
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <Link to="/profile">Profile</Link>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/authpage">
                <FontAwesomeIcon icon={faUser} className="text-xl cursor-pointer" />
              </Link>
            )}
            {isAuthenticated && (
              <div className="relative">
                <FontAwesomeIcon
                  icon={faCartShopping}
                  className="text-xl cursor-pointer"
                  onClick={() => setIsCartOpen(true)}
                />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />

          {/* Cart Sidebar */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Promotional Banner */}
            <div className="bg-pink-50 p-4 border-b">
              <div className="text-center mb-2">
                <span className="text-sm font-medium">1,00,000+ Happy Customers</span>
                <span className="text-pink-500 ml-1">💖</span>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-green-500" />
                  <span>COD Available</span>
                </div>
              </div>
            </div>

            {/* Sale Banner */}
            <div className="bg-purple-100 p-3 text-center border-b">
              <span className="text-sm font-medium text-purple-800">Rakhi Early Bird Sale is Live</span>
            </div>

            {/* Cart Items Header */}
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <span className="text-sm font-medium text-gray-600">PRODUCT</span>
              <span className="text-sm font-medium text-gray-600">TOTAL</span>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingCart className="w-12 h-12 mb-4" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-pink-50 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">₹ {item.price.toFixed(2)}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Price and Delete */}
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-semibold">₹ {(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-gray-400 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t bg-white p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Estimated Total</span>
                  <span className="text-lg font-bold">₹ {totalAmount.toFixed(2)}</span>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3>
                  {defaultAddress ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state},{' '}
                        {defaultAddress.postalCode}, {defaultAddress.country}
                      </p>
                      <Button
                        className="mt-2 w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                        onClick={openAddressForm}
                      >
                        Change Address
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                      onClick={openAddressForm}
                    >
                      Add Address
                    </Button>
                  )}

                  {/* Address Form Modal */}
                  {isAddressFormOpen && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label htmlFor="street" className="text-sm font-medium text-gray-700">
                            Street
                          </label>
                          <input
                            type="text"
                            id="street"
                            name="street"
                            value={addressForm.street}
                            onChange={handleAddressChange}
                            placeholder="Enter street address"
                            className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="city" className="text-sm font-medium text-gray-700">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressChange}
                            placeholder="Enter city"
                            className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="state" className="text-sm font-medium text-gray-700">
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={addressForm.state}
                            onChange={handleAddressChange}
                            placeholder="Enter state"
                            className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={addressForm.postalCode}
                            onChange={handleAddressChange}
                            placeholder="Enter postal code"
                            className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label htmlFor="country" className="text-sm font-medium text-gray-700">
                            Country
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={addressForm.country}
                            onChange={handleAddressChange}
                            placeholder="Enter country"
                            className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                          onClick={saveAddress}
                        >
                          Save Address
                        </Button>
                        <Button
                          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition-colors"
                          onClick={cancelAddressForm}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg transition-colors"
                  onClick={handleCheckout}
                  disabled={!defaultAddress}
                >
                  CHECK OUT
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;