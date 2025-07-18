"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { Minus, Plus, ShoppingCart, X, Trash2, Loader2, User } from "lucide-react";
import { toast } from 'react-toastify';
import useAuthStore, { selectIsAuthenticated, selectUser, selectLogout } from '../stores/useAuthStore';
import logo from '../assets/image/logo.png';
import logo1 from '../assets/image/logo1.png';
import { Button } from './ui/button';
import { LoginReminderModal } from './ui/login-reminder-modal';

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
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [cartLoading, setCartLoading] = useState(false);
  const desktopProfileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  // Add transfer flag to prevent duplicate transfers
  const [isTransferringCart, setIsTransferringCart] = useState(false);
  const transferAttempted = useRef(false);
  // Add new state for modal
  const [isLoginReminderOpen, setIsLoginReminderOpen] = useState(false);
  const reminderIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore(selectUser);
  const logout = useAuthStore(selectLogout);

  const CartItemSkeleton = () => (
    <div className="flex gap-4 animate-pulse p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl"></div>
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-2"></div>
        <div className="h-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg w-1/2 mb-2"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg"></div>
          <div className="w-8 h-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded"></div>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg"></div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded w-12"></div>
        <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg"></div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setCartLoading(true);
        try {
          // First, check if there are any items in localStorage
          const localCart = localStorage.getItem('cartItems');
          if (localCart) {
            const localCartItems = JSON.parse(localCart);
            
            // If there are items, add them to the user's cart
            if (localCartItems.length > 0) {
              try {
                const productIds = localCartItems.map((item: CartItem) => item.id);
                const quantities = localCartItems.map((item: CartItem) => item.quantity);
                
                await fetch('https://api.vivahartstudio.com/api/users/cart/add', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    productId: productIds,
                    quantity: quantities,
                  }),
                });
                
                // Clear localStorage cart after successful transfer
                localStorage.removeItem('cartItems');
              } catch (err) {
                console.error('Error transferring local cart to user cart:', err);
              }
            }
          }

          // Then fetch the updated cart from server
          const response = await fetch('https://api.vivahartstudio.com/api/users/cart-users', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
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
            const defaultAddr = data.data[0].addresses?.find((addr: Address) => addr.isDefault);
            if (defaultAddr) {
              setDefaultAddress(defaultAddr);
              setAddressForm(defaultAddr);
            }
          }
        } catch (err) {
          console.error('Error fetching cart:', err);
          toast.error('Failed to load cart');
        } finally {
          setCartLoading(false);
        }
      } else {
        // Load cart from localStorage for non-logged in users
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    fetchCart();

    // Listen for storage events to update cart
    const handleStorageChange = () => {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update local storage when cart changes for non-logged in users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const displayedTotal = totalAmount > 500 ? totalAmount - 60 : totalAmount;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddressForm = () => {
    setIsAddressFormOpen(true);
    if (defaultAddress) {
      setAddressForm(defaultAddress);
    }
  };

  const saveAddress = () => {
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.postalCode || !addressForm.country) {
      toast.error('Please fill in all address fields');
      return;
    }
    setDefaultAddress(addressForm);
    setIsAddressFormOpen(false);
    toast.success('Address saved successfully');
  };

  const cancelAddressForm = () => {
    setIsAddressFormOpen(false);
    setAddressForm(defaultAddress || { street: '', city: '', state: '', postalCode: '', country: '', isDefault: true });
  };

  const debouncedApiCall = useCallback((productId: string, quantity: number, isAdd: boolean = true) => {
    const existingTimer = debounceTimers.current.get(productId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(async () => {
      if (isAuthenticated && localStorage.getItem('token')) {
        try {
          const endpoint = isAdd ? '/api/users/cart/add' : '/api/users/cart/remove';
          const body = isAdd 
            ? { productId: [productId], quantity: [quantity] }
            : { productId: productId, quantity: quantity };

          await fetch(`https://api.vivahartstudio.com${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(body),
          });

          setLoadingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });

          toast.success(isAdd ? 'Cart updated' : 'Item updated');
        } catch (err) {
          console.error('Error updating cart:', err);
          toast.error('Error updating cart');
          setLoadingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
        }
      }
      debounceTimers.current.delete(productId);
    }, 1000);

    debounceTimers.current.set(productId, timer);
  }, [isAuthenticated]);

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    setLoadingItems(prev => new Set(prev).add(id));
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );

    const token = localStorage.getItem('token');
    if (token) {
      debouncedApiCall(id, newQuantity, true);
    } else {
      setTimeout(() => {
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success('Cart updated');
      }, 500);
    }
  };

  const decreaseQuantity = async (id: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      removeItem(id);
      return;
    }

    const newQuantity = currentQuantity - 1;
    setLoadingItems(prev => new Set(prev).add(id));
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );

    const token = localStorage.getItem('token');
    if (token) {
      debouncedApiCall(id, 1, false);
    } else {
      setTimeout(() => {
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success('Cart updated');
      }, 500);
    }
  };

  const removeItem = async (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    if (!itemToRemove) return;

    setLoadingItems(prev => new Set(prev).add(id));
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('https://api.vivahartstudio.com/api/users/cart/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            productId: id, 
            quantity: itemToRemove.quantity 
          }),
        });

        toast.success('Item removed from cart');
      } catch (err) {
        console.error('Error removing item from cart:', err);
        toast.error('Error removing item');
        setCartItems(prev => [...prev, itemToRemove]);
      } finally {
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } else {
      setTimeout(() => {
        setLoadingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        toast.success('Item removed from cart');
      }, 500);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        for (const item of cartItems) {
          await fetch('https://api.vivahartstudio.com/api/users/cart/remove', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
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

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to proceed with checkout');
      setIsCartOpen(false);
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
      const response = await fetch('https://api.vivahartstudio.com/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

        const options = {
          key: 'rzp_live_PGEwo7ezA19T7p',
          amount: order.totalAmount * 100,
          currency: 'INR',
          name: 'Your Store Name',
          description: `Order Payment #${order._id}`,
          order_id: razorpayOrderId,
          handler: async () => {
            await clearCart();
            toast.success('Payment successful! Order placed.');
            navigate('/order-confirmation', { state: { orderId: order._id, transactionId } });
          },
          prefill: {
            name: `${user?.firstName} ${user?.lastName}`,
            email: user?.email,
            contact: '',
          },
          theme: {
            color: '#800080',
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

  // Click-outside handler for desktop profile dropdown only
  useEffect(() => {


    // document.addEventListener('mousedown', handleClickOutside);
    // return () => {
    //   document.removeEventListener('mousedown', handleClickOutside);
    // };
  }, []);

  useEffect(() => {
    return () => {
      debounceTimers.current.forEach(timer => clearTimeout(timer));
      debounceTimers.current.clear();
    };
  }, []);

  const transferLocalCartToUserCart = async (token: string) => {
    // If already transferring or transfer was attempted, don't proceed
    if (isTransferringCart || transferAttempted.current) return;

    const localCart = localStorage.getItem('cartItems');
    if (!localCart) return;

    try {
      setIsTransferringCart(true);
      transferAttempted.current = true;
      let localCartItems: CartItem[] = [];
      
      try {
        localCartItems = JSON.parse(localCart);
        if (!Array.isArray(localCartItems) || localCartItems.length === 0) {
          localStorage.removeItem('cartItems');
          return;
        }
      } catch (e) {
        console.error('Error parsing local cart data:', e);
        localStorage.removeItem('cartItems');
        return;
      }

      // Remove localStorage cart first to prevent duplicate transfers
      localStorage.removeItem('cartItems');

      // First fetch current cart to check for existing items
      const currentCartResponse = await fetch('https://api.vivahartstudio.com/api/users/cart-users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const currentCartData = await currentCartResponse.json();
      
      const currentCart = currentCartData.status === 'success' && currentCartData.data[0]?.cart 
        ? currentCartData.data[0].cart 
        : [];

      // Create a map of existing items with their quantities
      const existingItems = new Map();
      currentCart.forEach((item: any) => {
        existingItems.set(item.product._id, item.quantity);
      });

      // Process items to add or update
      const itemsToAdd: { id: string; quantity: number }[] = [];
      
      localCartItems.forEach(localItem => {
        const existingQuantity = existingItems.get(localItem.id) || 0;
        if (existingQuantity === 0) {
          // New item
          itemsToAdd.push({
            id: localItem.id,
            quantity: localItem.quantity
          });
        }
        // We don't update existing items' quantities
      });

      if (itemsToAdd.length > 0) {
        // Make a single API call for all new items
        const addResponse = await fetch('https://api.vivahartstudio.com/api/users/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: itemsToAdd.map(item => item.id),
            quantity: itemsToAdd.map(item => item.quantity),
          }),
        });

        const addData = await addResponse.json();
        if (addData.status === 'success') {
          toast.success('Cart items transferred successfully');
        }
      }

      // Refresh cart from server
      const response = await fetch('https://api.vivahartstudio.com/api/users/cart-users', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      }
    } catch (err) {
      console.error('Error transferring local cart to user cart:', err);
      toast.error('Failed to transfer cart items');
    } finally {
      setIsTransferringCart(false);
    }
  };

  // Effect to handle cart transfer when user logs in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated && !transferAttempted.current) {
      transferLocalCartToUserCart(token);
    }
  }, [isAuthenticated]);

  // Add useEffect for login reminder
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Only set up reminder if user is not logged in
    if (!token && !isAuthenticated) {
      // Initial delay of one minute
      const initialDelay = setTimeout(() => {
        setIsLoginReminderOpen(true);
      }, 60000); // 60 seconds

      // Set up recurring reminder
      reminderIntervalRef.current = setInterval(() => {
        setIsLoginReminderOpen(true);
      }, 60000); // 60 seconds

      return () => {
        clearTimeout(initialDelay);
        if (reminderIntervalRef.current) {
          clearInterval(reminderIntervalRef.current);
        }
      };
    } else if (reminderIntervalRef.current) {
      // Clear interval if user logs in
      clearInterval(reminderIntervalRef.current);
    }
  }, [isAuthenticated]);

  // Add handler to close modal
  const handleCloseLoginReminder = useCallback(() => {
    setIsLoginReminderOpen(false);
  }, []);

  // Reset transfer attempted flag on logout
  const handleLogout = useCallback(() => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
    localStorage.removeItem('token');
    transferAttempted.current = false;
  }, [logout, navigate]);

  const handleAuthClick = useCallback(() => {
    if (isAuthenticated) {
      setIsProfileOpen((prev) => !prev);
    } else {
      navigate('/authpage');
    }
  }, [isAuthenticated, navigate]);

  // Handle backdrop click to close only if clicking outside the sidebar


  return (
    <>
      <header className="w-full bg-transparent shadow-sm">
        {/* Mobile Header */}
        <nav className="lg:hidden bg-transparent">
          <div className="flex justify-between items-center px-4 py-4">
            <div className="flex items-center space-x-4">
              {/* Placeholder for hamburger menu */}
            </div>
            <Link to="/" className="text-2xl font-bold text-purple-700">
              <img src={logo} alt="logo" className="w-50 h-17" />
            </Link>

            <div className="flex items-center space-x-4">
              {/* Always show user icon in mobile view */}
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-purple-100"
                    onClick={handleAuthClick}
                  >
                    <User className="h-5 w-5 text-black" />
                  </Button>
                  {isProfileOpen && (
                    <div className="fixed inset-0 z-50">
                      <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                      />
                      <div
                        className="absolute top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl flex flex-col"
                      >
                        <div className="flex items-center justify-between p-4 border-b">
                          <h2 className="text-xl font-semibold">Profile</h2>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Close profile sidebar"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="text-sm text-gray-700 border-b border-gray-100 pb-2">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div>
                          <Link
                            to="/profile"
                            className="block text-sm text-gray-700 hover:bg-gray-100 p-2 rounded"
                          >
                            Profile
                          </Link>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left text-sm text-red-600 hover:bg-gray-100 p-2 rounded"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/authpage">
                  <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                    <User className="h-5 w-5 text-black" />
                  </Button>
                </Link>
              )}
              {/* Show cart icon for all users */}
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
            </div>
          </div>
        </nav>

        {/* Desktop Header */}
        <nav className="hidden lg:block container mx-auto px-4 py-4 bg-transparent">
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

            <Link to={isAuthenticated ? "/" : "/"} className="text-3xl font-bold text-purple-700 ml-[100px] contain-content">
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
              {isAuthenticated ? (
                <div className="relative" ref={desktopProfileRef}>
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
              {/* Show cart icon for all users */}
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
            </div>
          </div>
        </nav>

        {/* Cart Sidebar */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="bg-pink-50 border-b items-center">
                <img src={logo1} alt="logo" className="w-30 h-30 object-cover items-center ml-[170px] mt-[-10px]" />
              </div>
              <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <span className="text-sm font-medium text-gray-600">PRODUCT</span>
                <span className="text-sm font-medium text-gray-600">TOTAL</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {cartLoading ? (
                  <div className="space-y-4 p-4">
                    {[...Array(3)].map((_, index) => (
                      <CartItemSkeleton key={index} />
                    ))}
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ShoppingCart className="w-12 h-12 mb-4" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-pink-50 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">₹ {item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 bg-transparent relative"
                              onClick={() => decreaseQuantity(item.id, item.quantity)}
                              disabled={loadingItems.has(item.id)}
                            >
                              {loadingItems.has(item.id) ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="w-8 h-8 bg-transparent relative"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={loadingItems.has(item.id)}
                            >
                              {loadingItems.has(item.id) ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Plus className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-sm font-semibold">₹ {(item.price * item.quantity).toFixed(2)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 text-gray-400 hover:text-red-500 relative"
                            onClick={() => removeItem(item.id)}
                            disabled={loadingItems.has(item.id)}
                          >
                            {loadingItems.has(item.id) ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="border-t bg-white p-6 space-y-6 overflow-y-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Estimated Total</span>
                    {totalAmount >= 500 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold line-through text-gray-500">₹ {totalAmount.toFixed(2)}</span>
                        <span className="text-lg font-bold text-green-600">₹ {displayedTotal.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold">₹ {totalAmount.toFixed(2)}</span>
                    )}
                  </div>
                  {totalAmount >= 500 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700 font-medium">
                        🎉 Congratulations! You saved ₹60 on this order!
                      </p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Shipping Address</h3>
                    {!isAddressFormOpen ? (
                      defaultAddress ? (
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
                      )
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <label htmlFor="street" className="text-sm font-medium text-gray-700">
                              Main Address
                            </label>
                            <input
                              type="text"
                              id="street"
                              name="street"
                              value={addressForm.street}
                              onChange={handleAddressChange}
                              placeholder="Enter main address"
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
                          <div className="space-y-1">
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

      {/* Add LoginReminderModal */}
      <LoginReminderModal
        isOpen={isLoginReminderOpen}
        onClose={handleCloseLoginReminder}
      />
    </>
  );
};

export default Header;