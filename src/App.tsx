import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/authpage';
import './App.css';
import useAuthStore from './stores/useAuthStore';
import { useEffect } from 'react';
import OrderConfirmation from './pages/OrderConfirmation';
import UserProfile from './pages/profile';

// Protected Route wrapper component

function App() {
  const isAuthenticated = useAuthStore((state: { isAuthenticated: boolean }) => state.isAuthenticated);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.clear();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Auth route */}
        <Route path="/authpage" element={<Auth />} />
        {/* Protected routes */}
        <Route path="/" element={
            <Home />
        } />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* Catch all route - redirect to auth */}
      </Routes>
    </Router>
  );
}

export default App;
