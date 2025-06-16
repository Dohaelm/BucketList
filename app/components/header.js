// Header Component 
'use client';
import { Heart, Plus, Camera, Check, X, Upload, Image } from 'lucide-react';
import React, { useState } from 'react';

const Header = ({ currentUser, setCurrentUser }) => {

  return (
    <header className="bg-slate-900/80 backdrop-blur-md shadow-2xl border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Heart className="text-amber-400 animate-pulse" size={32} />
          <span className="text-xl font-semibold text-transparent bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text">
           Our Bucket List 
          </span>
        </div>
        
        <div className="flex items-center gap-4">
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
                src="/avatars/anas.png" 
                alt="Anas" 
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
                src="/avatars/doha.png" 
                alt="Doha" 
                className="w-8 h-8 rounded-full border-2 border-purple-400 shadow-sm ring-2 ring-purple-500/20"
              />
              Doha 💜
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;