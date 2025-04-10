// GlobalShimmer.jsx
import React from 'react';
import { GridLoader, ClimbingBoxLoader } from 'react-spinners';

const GlobalShimmer = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <ClimbingBoxLoader 
        size={30} // Makes the spinner bigger (default is 15)
        color="#eab308" // Golden yellow color (Tailwind's yellow-500)
        speedMultiplier={1.5} // Slightly faster animation
      />
    </div>
  );
};

export default GlobalShimmer;