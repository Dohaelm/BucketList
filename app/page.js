'use client';
import React, { useState, useEffect } from 'react';
import { Lock, Star, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/authProvider';

const StarryEntryPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [stars, setStars] = useState([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/bucketlist';
    }
  }, [isAuthenticated]);

  // Generate random stars for background
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 150; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          delay: Math.random() * 3,
          duration: Math.random() * 2 + 2
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the password');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await login(password);
    
    if (result.success) {
      // Redirect will happen automatically via useEffect
      window.location.href = '/bucketlist';
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  // Prevent going back to this page if authenticated
  useEffect(() => {
    const preventBack = () => {
      if (isAuthenticated) {
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', preventBack);
    
    return () => {
      window.removeEventListener('popstate', preventBack);
    };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated Starry Background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
        
        {/* Additional animated elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-amber-300 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-60 left-1/2 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700"></div>
        
        {/* Shooting stars */}
        <div className="absolute top-1/4 left-0 w-1 h-1 bg-white rounded-full opacity-70 animate-ping delay-1000"></div>
        <div className="absolute top-3/4 right-0 w-1 h-1 bg-amber-200 rounded-full opacity-70 animate-ping delay-2000"></div>
      </div>

      {/* Main Entry Form */}
      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Star className="text-amber-400 animate-pulse mx-auto mb-4" size={60} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-amber-300 via-purple-300 to-blue-300 bg-clip-text mb-4" style={{fontFamily: 'Dancing Script, cursive'}}>
            Enter the Constellation ✨
          </h1>
          <p className="text-slate-300 text-lg">
            Whisper the secret to unlock the bucket list 
          </p>
        </div>

        {/* Entry Form */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-700/50 hover:border-purple-500/30 transition-all duration-500">
          <div className="space-y-6">
            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
                placeholder="Enter your cosmic password..."
                className="w-full pl-12 pr-12 py-4 bg-slate-700/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all backdrop-blur-sm"
                disabled={isSubmitting}
              />
              
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !password.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Unlocking the stars...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Star size={20} />
                  Enter the Constellation
                </span>
              )}
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center mt-8 space-x-4 text-2xl opacity-70">
            <span className="animate-pulse delay-0">🌟</span>
            <span className="animate-pulse delay-300">💫</span>
            <span className="animate-pulse delay-600">✨</span>
            <span className="animate-pulse delay-900">🌙</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Plans to be achieved, memories to be made.
          </p>
        </div>
      </div>

      {/* Floating Constellation Elements */}
      <div className="absolute top-10 right-10 opacity-30">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-4 left-16 w-1 h-1 bg-amber-300 rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-8 left-4 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-12 left-12 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1500"></div>
          <div className="absolute top-16 left-0 w-1 h-1 bg-white rounded-full animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 opacity-30">
        <div className="relative w-20 h-20">
          <div className="absolute top-2 left-2 w-1 h-1 bg-amber-300 rounded-full animate-pulse delay-0"></div>
          <div className="absolute top-8 left-10 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-16 left-6 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1400"></div>
          <div className="absolute top-12 left-18 w-1 h-1 bg-white rounded-full animate-pulse delay-2100"></div>
        </div>
      </div>
    </div>
  );
};

export default StarryEntryPage;