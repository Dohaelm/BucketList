'use client';
import Image from 'next/image'
import { Heart, Plus, Camera, Check, X, Upload } from 'lucide-react';
import PlanCard from './planCard';
import React, { useState } from 'react';

// Plan List Component
const PlanList = ({ plans, onAchieve, onDelete }) => {
  // Add safety check for plans prop
  if (!plans || plans.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto text-amber-400 mb-4 animate-pulse" size={64} />
        <p className="text-slate-300 text-lg">No plans in your constellation yet. Begin your journey! ✨</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {plans.map((plan, index) => (
        <PlanCard 
          key={plan.id || `plan-${index}`} // Use plan.id if available, fallback to index
          plan={plan} 
          onAchieve={onAchieve}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PlanList;