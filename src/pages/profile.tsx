import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/profile';
import { useState, useEffect } from "react"
import FullScreenLoader from "../components/Fullscreenloder"
const ProfilePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);
  if (isLoading) {
    return <FullScreenLoader message="Loading your experience..." isVisible={isLoading} />;
  }
  return (
    <div className="min-h-screen bg-white">
      <Header />
<Profile />
      <Footer />
    </div>
  );
};

export default ProfilePage; 