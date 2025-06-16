'use client';
import { Heart, Plus, Camera, Check, X, Upload, Image } from 'lucide-react';
import React, { useState } from 'react';

// Photo Upload Modal Component
const PhotoUploadModal = ({ plan, onComplete, onClose }) => {
  const [photoPreview, setPhotoPreview] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handlePhotoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handlePhotoUpload(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      {/* Floating Stars Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-amber-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-indigo-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-rose-400 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-purple-900/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-purple-400 to-blue-400 bg-clip-text text-transparent" 
              style={{fontFamily: 'Dancing Script, cursive'}}>
            Capture the Starlit Moment! ✨
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-amber-400 transition-colors duration-300 hover:scale-110 transform hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-slate-300 mb-4 text-center">
            Add a photo to immortalize this memory.
          </p>
          
          {!photoPreview ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                dragActive 
                  ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/20' 
                  : 'border-slate-600 hover:border-purple-400 hover:bg-purple-400/5 hover:shadow-lg hover:shadow-purple-400/10'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('photo-input').click()}
            >
              <div className="relative">
                <Image className={`mx-auto mb-4 transition-colors duration-300 ${
                  dragActive ? 'text-amber-400' : 'text-purple-400'
                }`} size={48} />
                {/* Sparkle effect */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-500"></div>
              </div>
              
              <p className="text-slate-300 mb-2 font-medium">Click to upload or drag & drop your memory</p>
              <p className="text-slate-500 text-sm">PNG, JPG, GIF up to 10MB</p>
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative group">
              <img 
                src={photoPreview} 
                alt="Starlit Preview"
                className="w-full h-64 object-cover rounded-2xl shadow-lg border border-slate-600/50 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Floating sparkles around the image */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-amber-400 rounded-full animate-pulse opacity-70"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300"></div>
              <div className="absolute top-4 right-12 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-700"></div>
              
              <button
                onClick={() => setPhotoPreview('')}
                className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-sm text-white rounded-full p-2 hover:bg-red-600 transition-all duration-300 shadow-lg hover:scale-110 border border-red-400/30"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onComplete(plan.id, photoPreview)}
            className="flex-1 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-3 rounded-full hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 border border-purple-500/30"
          >
            {photoPreview ? 'Complete with Starlit Photo ✨' : 'Complete this Wish ⭐'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-slate-600 text-slate-300 rounded-full hover:bg-slate-700/50 hover:border-amber-400/50 hover:text-amber-400 transition-all duration-300 backdrop-blur-sm"
          >
            Cancel
          </button>
        </div>
        
        {/* Additional atmospheric elements */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 rounded-3xl"></div>
      </div>
    </div>
  );
};

export default PhotoUploadModal;