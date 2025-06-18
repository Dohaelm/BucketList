'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/authProvider';

const Header = ({ currentUser, setCurrentUser }) => {
  const { logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="relative z-20 bg-slate-900/70 backdrop-blur-md border-b border-slate-800/50 shadow-2xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌟</div>
            <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text">
              Our Bucket List
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Selector */}
            <span className="text-slate-300">User :</span>
          <div className="flex bg-slate-800/50 rounded-full p-1 border border-slate-700/50 backdrop-blur-sm">
            <button
              onClick={() => setCurrentUser('Anas')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-3 ${
                currentUser === 'Anas' 
                  ? 'bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-blue-400 hover:bg-slate-700/50 hover:text-blue-300'
              }`}
            >
              <Image
                src="/avatars/Anas.png" 
                alt="Anas" 
                width={80}
                height={80}
                className="w-8 h-8 rounded-full border-2 border-blue-800 shadow-sm ring-2 ring-blue-900/20"
              />
              Anas 💙
            </button>
            <button
              onClick={() => setCurrentUser('Doha')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-3 ${
                currentUser === 'Doha' 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-purple-400 hover:bg-slate-700/50 hover:text-purple-300'
              }`}
            >
              <Image
                src="/avatars/Doha.png" 
                alt="Doha" 
                width={80}
                height={80}
                className="w-8 h-8 rounded-full border-2 border-purple-400 shadow-sm ring-2 ring-purple-500/20"
              />
              Doha 💜
            </button>
          </div>

            {/* Logout Button - Subtle and Small */}
            <button
              onClick={confirmLogout}
              className="bg-slate-700/50 hover:bg-slate-600/60 text-slate-300 hover:text-slate-200 px-3 py-2 rounded-lg flex items-center gap-2 transition-all border border-slate-600/30 hover:border-slate-500/50 backdrop-blur-sm"
              title="Logout"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-4">🌙</div>
              <h3 className="text-xl font-bold text-white mb-4">Leave the Constellation?</h3>
              <p className="text-slate-300 mb-6">
                Are you sure you want to logout? You will need to enter the cosmic password again to return.
              </p>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={cancelLogout}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all"
                >
                  Stay Among the Stars
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;