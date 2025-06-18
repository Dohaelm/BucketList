'use client';

import Image from 'next/image'

import React, { useState, useEffect } from 'react';
import { Heart, Plus, Camera, Check, X, Upload } from 'lucide-react';
import Header from '../components/header';
import PlanList from '../components/planList';
import PlanForm from '../components/planform';
import PhotoAlbum from '../components/photoAlbum';
import { useAuth } from '@/lib/authProvider';
import '../globals.css';

const AuthLoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
        <p className="text-slate-300 text-lg">Checking constellation access...</p>
      </div>
    </div>
  );
};
// Celebration Overlay Component
const CelebrationOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="text-6xl animate-bounce">
        🌟💫✨
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
    </div>
  );
};

// No Plans Component
const NoDreamsYet = () => {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🌙</div>
      <h3 className="text-2xl font-bold text-amber-300 mb-2">No Plans Under the Stars Yet!</h3>
      <p className="text-slate-300 mb-6">Begin your enchanted journey by adding your first shared plan</p>
      <div className="text-4xl">✨🌟💫</div>
    </div>
  );
};

// Main Bucket List Component
const BucketListPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState('Anas');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showPhotoAlbum, setShowPhotoAlbum] = useState(false);
  const [celebrationId, setCelebrationId] = useState(null);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);

  // Prevent back navigation when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const preventBack = (e) => {
        window.history.pushState(null, '', window.location.pathname);
      };

      // Push current state to prevent back navigation
      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', preventBack);
      
      return () => {
        window.removeEventListener('popstate', preventBack);
      };
    }
  }, [isAuthenticated]);
  // Fetch plans from database
  const fetchPlans = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch('/api/get-plans', { method: 'GET' });
    const data = await response.json();
    
    if (response.ok) {
      // Filter out null plans (deleted ones) and parse JSON strings
      const validPlans = data.plans
        .filter(plan => plan !== null)
        .map(plan => {
          // Parse the plan if it's a JSON string
          if (typeof plan === 'string') {
            try {
              return JSON.parse(plan);
            } catch (parseError) {
              console.error('Error parsing plan:', parseError, plan);
              return null; // Return null for invalid JSON
            }
          }
          return plan; // Return as-is if already an object
        })
        .filter(plan => plan !== null); // Remove any plans that failed to parse
      
      setPlans(validPlans);
    } else {
      setError(data.error || 'Failed to fetch plans');
    }
  } catch (err) {
    setError('Failed to connect to server');
    console.error('Error fetching plans:', err);
  } finally {
    setLoading(false);
  }
};

// Load plans when component mounts
 useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchPlans();
    }
  }, [isAuthenticated, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <AuthLoadingSpinner />;
  }

// Filter plans based on current filter
const filteredPlans = plans.filter(plan => {
  if (filter === 'All') return true;
  return plan.status === filter.toLowerCase();
});

const achievedPlansWithPhotos = plans.filter(plan => 
  plan.status === 'achieved' && plan.image
);

// Add new plan - Updated to use API
const addPlan = async (planData) => {
  try {
    const response = await fetch('/api/add-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: planData.title,
          description: planData.description,
          author: currentUser,
          image: planData.image || null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new plan to the local state
        setPlans([...plans, data.plan]);
        setShowForm(false);
      } else {
        setError(data.error || 'Failed to add plan');
      }
    } catch (err) {
      setError('Failed to add plan');
      console.error('Error adding plan:', err);
    }
  };

  // Mark plan as achieved - Updated to use API
  const achievePlan = async (id, photo = null) => {
  try {
    const body = { id };
    if (photo) {
      body.image = photo; // Automatically means "achieved"
    } else {
      body.status = 'achieved';
    }

    const response = await fetch('/api/update-plan', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      setPlans(plans.map(plan => 
        plan.id === id 
          ? { ...data.plan }
          : plan
      ));
      setCelebrationId(id);
      setTimeout(() => setCelebrationId(null), 2000);
    } else {
      setError(data.error || 'Failed to update plan');
    }
  } catch (err) {
    setError('Failed to update plan');
    console.error('Error updating plan:', err);
  }
};


  // Delete plan - Updated to use API
  const deletePlan = async (id) => {
    try {
      const response = await fetch('/api/delete-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the plan from local state
        setPlans(plans.filter(plan => plan.id !== id));
      } else {
        setError(data.error || 'Failed to delete plan');
      }
    } catch (err) {
      setError('Failed to delete plan');
      console.error('Error deleting plan:', err);
    }
  };

  // Retry function for error handling
  const handleRetry = () => {
    fetchPlans();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-amber-300 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-60 left-1/2 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700"></div>
      </div>

      {/* Celebration Animation */}
      {celebrationId && <CelebrationOverlay />}
      
      {/* Header */}
      <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
     
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <Image 
                src="/avatars/Anas.png" 
                alt="Anas" 
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-blue-900 shadow-2xl ring-4 ring-blue-900/20"
              />
              <Heart className="text-amber-400 animate-pulse" size={40} />
              <Image 
                src="/avatars/Doha.png" 
                alt="Doha"
                width={80} 
                height={80}
                className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-2xl ring-4 ring-purple-500/20"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-amber-300 via-purple-300 to-blue-300 bg-clip-text mb-4" style={{fontFamily: 'Dancing Script, cursive'}}>
              Constellation of Dreams ✨
            </h1>
            <p className="text-slate-300 text-lg"> Filling the bucket is just as important as emptying it!</p>
          </div>

          {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 flex justify-between items-center backdrop-blur-sm">
            <span>{error}</span>
            <button 
              onClick={handleRetry}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 text-center shadow-2xl border border-slate-700/50 hover:border-amber-500/50 transition-all">
            <div className="text-3xl font-bold text-amber-300">{plans.length}</div>
            <div className="text-slate-400">Total Dreams</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 text-center shadow-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all">
            <div className="text-3xl font-bold text-emerald-400">{plans.filter(p => p.status === 'achieved').length}</div>
            <div className="text-slate-400">Stars Captured</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 text-center shadow-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all">
            <div className="text-3xl font-bold text-purple-400">{plans.filter(p => p.status === 'unachieved').length}</div>
            <div className="text-slate-400">Wishes Waiting</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 border border-purple-500/30"
          >
            <Plus size={20} />
            Cast a New Plan
          </button>
          
          {achievedPlansWithPhotos.length > 0 && (
            <button 
              onClick={() => setShowPhotoAlbum(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-amber-500/25 border border-amber-500/30"
            >
              <Camera size={20} />
              Memory Constellation ({achievedPlansWithPhotos.length})
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        {!loading && plans.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-full p-2 shadow-lg border border-slate-700/50">
              {['All', 'Unachieved', 'Achieved'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    filter === tab 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  {tab} {tab === 'All' ? `(${plans.length})` : `(${plans.filter(p => p.status === tab.toLowerCase()).length})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Plans List or No Dreams */}
        {!loading && (
          <>
            {plans.length === 0 ? (
              <NoDreamsYet />
            ) : (
              <PlanList 
                plans={filteredPlans} 
                onAchieve={achievePlan}
                onDelete={deletePlan}
              />
            )}
          </>
        )}

        {/* Modals */}
        {showForm && (
          <PlanForm 
            onSubmit={addPlan} 
            onClose={() => setShowForm(false)}
            author={currentUser}
          />
        )}

        {showPhotoAlbum && (
          <PhotoAlbum 
            plans={achievedPlansWithPhotos}
            onClose={() => setShowPhotoAlbum(false)}
          />
        )}
      </main>
    </div>
  );
};

export default BucketListPage;