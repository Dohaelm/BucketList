'use client';
import { Heart, Plus, Camera, Check, X, Upload } from 'lucide-react';
import Image from 'next/image'
import React, { useState } from 'react';

// Photo Album Component
const PhotoAlbum = ({ plans, onClose }) => {
  // Filter plans that have images and are achieved
  const achievedPlansWithImages = plans.filter(plan => 
    plan.image && plan.status === 'achieved'
  );

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      {/* Floating Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping delay-700"></div>
      </div>

      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 max-w-4xl w-full h-5/6 shadow-2xl shadow-purple-900/20 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-purple-400 to-blue-400 bg-clip-text text-transparent" 
              style={{fontFamily: 'Dancing Script, cursive'}}>
            Our Starlit Memories ✨
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-amber-400 transition-colors duration-300 hover:scale-110 transform"
          >
            <X size={24} />
          </button>
        </div>
        
        {achievedPlansWithImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="relative">
              <Camera size={64} className="mb-4 text-purple-400" />
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-lg text-slate-300 mb-2">No starlit moments captured yet!</p>
            <p className="text-sm text-slate-500">Add photos to fill your constellation of memories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto h-full pb-8 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            {achievedPlansWithImages.map(plan => (
              <div key={plan.id} className="group bg-slate-800/60 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-300 hover:scale-[1.02] hover:border-amber-400/30">
                <div className="relative mb-3 overflow-hidden rounded-xl">
                  <img 
                    src={plan.image} 
                    alt={plan.title || "Starlit Memory"}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {plan.title && (
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-slate-200 px-3 py-1 rounded-lg text-xs border border-slate-700/50">
                      {plan.title}
                    </div>
                  )}
                  
                  {/* Floating sparkle effect */}
                  <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-70"></div>
                </div>
                
                <p className="text-slate-300 text-sm mb-3 leading-relaxed line-clamp-3">
                  {plan.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                       <Image 
                                                  src={plan.author === 'Anas' ? '/avatars/Anas.png' : '/avatars/Doha.png'}
                                                  alt={plan.author}
                                                   width={80}
                                                   height={80}
                                                  className={`w-12 h-12 rounded-full border-3 shadow-lg ${
                                                    plan.author === 'Anas' 
                                                      ? 'border-blue-500 ring-4 ring-blue-500/20' 
                                                      : 'border-purple-500 ring-4 ring-purple-500/20'
                                                  }`}
                                                    />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                        plan.author === 'Anas' ? 'bg-blue-400' : 'bg-pink-400'
                      } animate-pulse`}></div>
                    </div>
                    <span className="text-xs text-slate-400">{plan.author}</span>
                    <span className="text-sm">{plan.author === 'Anas' ? '💙' : '💖'}</span>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-full">
                    {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : 'Upon a time'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
          background-color: #475569;
          border-radius: 3px;
        }
        .scrollbar-track-slate-800::-webkit-scrollbar-track {
          background-color: #1e293b;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PhotoAlbum;