'use client';
import React, { useState } from 'react';
import { Heart, Plus, Camera, Check, X, Upload } from 'lucide-react';
import Image from 'next/image'
import PhotoUploadModal from './photoUploadModal';

const PlanCard = ({ plan, onAchieve, onDelete }) => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleMarkAsDone = () => {
    if (plan.status === 'unachieved') {
      setShowPhotoModal(true);
    }
  };

  const handlePhotoComplete = (planId, photo) => {
    onAchieve(planId, photo);
    setShowPhotoModal(false);
  };

  return (
    <>
      <div className={`bg-slate-800/50 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-l-4 ${
        plan.author === 'Anas' 
          ? 'border-blue-500 hover:border-blue-400 hover:shadow-blue-500/10' 
          : 'border-purple-500 hover:border-purple-400 hover:shadow-purple-500/10'
      } transition-all hover:shadow-3xl border border-slate-700/50 group hover:bg-slate-800/70`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={`/avatars/${plan.author?.toLowerCase() || 'default'}.png`}
              alt={plan.author || 'User'}
              className={`w-12 h-12 rounded-full border-3 shadow-lg ${
                plan.author === 'Anas' 
                  ? 'border-blue-500 ring-4 ring-blue-500/20' 
                  : 'border-purple-500 ring-4 ring-purple-500/20'
              }`}
            />
            <div>
              <span className="font-semibold text-slate-200 text-lg">{plan.author}</span>
              <span className="ml-2 text-lg">{plan.author === 'Anas' ? '💙' : '💜'}</span>
              <div className="text-sm text-slate-400">Wishes upon stars</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
              plan.status === 'achieved' 
                ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/50' 
                : 'bg-amber-900/50 text-amber-300 border-amber-500/50'
            }`}>
              {plan.status === 'achieved' ? '✨ Captured' : '🌙 Dreaming'}
            </span>
            
            <button
              onClick={() => onDelete(plan.id)}
              className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-900/20 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Plan Title */}
        <h4 className="text-xl font-bold text-transparent bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text mb-2 group-hover:from-amber-200 group-hover:to-purple-200 transition-all">
          {plan.title}
        </h4>
        
        {/* Plan Description */}
        <p className="text-slate-300 mb-4 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
          {plan.description}
        </p>

        {plan.image && (
          <div className="mb-4">
            <img 
              src={plan.image} 
              alt="Achievement memory"
              className="w-full h-48 object-cover rounded-2xl shadow-lg border border-slate-600/50 hover:border-amber-500/50 transition-all"
            />
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-400">
            Created: {new Date(plan.createdAt).toLocaleDateString()}
            {plan.achievedAt && (
              <span className="ml-4 text-emerald-400">
                Captured: {new Date(plan.achievedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {plan.status === 'unachieved' && (
            <button
              onClick={handleMarkAsDone}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 border border-emerald-500/30"
            >
              <Check size={16} />
              Capture This Star
            </button>
          )}
        </div>
      </div>

      {showPhotoModal && (
        <PhotoUploadModal
          plan={plan}
          onComplete={handlePhotoComplete}
          onClose={() => setShowPhotoModal(false)}
        />
      )}
    </>
  );
};

export default PlanCard;