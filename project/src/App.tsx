import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { PricingPage } from './pages/PricingPage';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    // Simulate user login - in a real app, this would come from your auth system
    setUser({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isPremium: false,
      subscriptionTier: 'free'
    });
  };

  const handleSignup = () => {
    // Simulate user signup
    setUser({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isPremium: false,
      subscriptionTier: 'free'
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/pricing" element={<PricingPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}