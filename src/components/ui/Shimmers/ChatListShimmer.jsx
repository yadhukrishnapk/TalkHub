import React from "react";

const ShimmerEffect = () => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Base skeleton */}
      <div className="w-full h-full bg-zinc-800/50 rounded-tl-2xl rounded-br-2xl"></div>
      
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0">
        <div className="w-[200%] h-full absolute top-0 -left-full animate-shimmer bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent"></div>
      </div>
    </div>
  );
};

const ChatListShimmer = () => {
  return (
    <div className="space-y-5 p-6">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-tl-2xl rounded-br-2xl overflow-hidden">
            <ShimmerEffect />
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/4 rounded-md overflow-hidden">
              <ShimmerEffect />
            </div>
            <div className="h-3 w-1/2 rounded-md overflow-hidden">
              <ShimmerEffect />
            </div>
          </div>
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <ShimmerEffect />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatListShimmer;