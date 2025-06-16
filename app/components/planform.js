'use client';
import { X } from 'lucide-react';
import React, { useState } from 'react';

const PlanForm = ({ onSubmit, onClose, author }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Just pass the form data to parent, don't make API call here
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        author,
      });
      
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Subtle animated background elements */}
        <div className="absolute top-4 right-8 w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-amber-300 to-purple-300 bg-clip-text" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Cast a New Wish
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors hover:bg-slate-700/50 rounded-full p-1"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-300 px-4 py-2 rounded-xl text-sm mb-4 border border-red-500/50 backdrop-blur-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={`/avatars/${author.toLowerCase()}.png`}
                alt={author}
                className={`w-12 h-12 rounded-full border-3 shadow-lg ${
                  author === 'Anas' 
                    ? 'border-blue-500 ring-4 ring-blue-500/20' 
                    : 'border-purple-500 ring-4 ring-purple-500/20'
                }`}
              />
              <div>
                <span className="font-semibold text-slate-200">{author}s Wish</span>
                <span className="ml-2">{author === 'Anas' ? '💙' : '💜'}</span>
                <div className="text-sm text-slate-400">Upon a star</div>
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-slate-300 mb-2 font-medium">Wish Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you wish for together..."
                className="w-full p-4 bg-slate-700/50 border-2 border-slate-600/50 rounded-2xl focus:border-amber-500/50 focus:outline-none text-slate-200 placeholder-slate-400 backdrop-blur-sm transition-all hover:border-slate-500/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
                }}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-slate-300 mb-2 font-medium">Your Plan Together</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your shared plan..."
                className="w-full p-4 bg-slate-700/50 border-2 border-slate-600/50 rounded-2xl focus:border-amber-500/50 focus:outline-none resize-none text-slate-200 placeholder-slate-400 backdrop-blur-sm transition-all hover:border-slate-500/50"
                rows={4}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
                }}
              />
            </div>

            <div className="text-xs text-slate-400 mt-1">Press Ctrl+Enter to cast your plan ✨</div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!title.trim() || !description.trim() || loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-purple-500/30"
            >
              {loading ? "Casting plan..." : "Cast Plan into Stars ✨"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-slate-600/50 text-slate-300 rounded-full hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-slate-200 transition-all backdrop-blur-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanForm;