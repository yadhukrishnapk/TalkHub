import React from "react";

const UserInfoShimmer = () => {
  return (
    <div className="bg-[#121212] h-full flex flex-col relative overflow-hidden">
      {/* Flowing Gradient Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-[200%] h-[200%] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent animate-flow"
          style={{
            animation: "flow 4s linear infinite",
          }}
        ></div>
      </div>

      {/* Profile Section Shimmer */}
      <div className="p-6 flex flex-col items-center border-b border-gray-800/50">
        <div className="w-24 h-24 rounded-tl-3xl rounded-br-3xl bg-gray-800/50 animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-yellow-400/20 to-gray-800 animate-shimmer"></div>
        </div>
        <div className="mt-4 h-6 w-32 bg-gray-800/50 rounded-full animate-pulse"></div>
        <div className="mt-4 w-full bg-gray-900/50 p-3 rounded-lg">
          <div className="h-3 w-16 bg-gray-800/50 rounded animate-pulse mb-2"></div>
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-gray-800/50 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-800/50 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Files Section Shimmer */}
      <div className="flex-1 p-6 space-y-4">
        <div className="h-5 w-28 bg-gray-800/50 rounded animate-pulse"></div>
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="bg-gray-900/50 rounded-tr-2xl rounded-bl-2xl p-4 flex items-center animate-pulse relative overflow-hidden"
          >
            <div className="w-10 h-10 bg-gray-800/50 rounded-full mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-800/50 rounded"></div>
              <div className="h-3 w-1/3 bg-gray-800/50 rounded"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/0 via-yellow-400/10 to-gray-900/0 animate-shimmer"></div>
          </div>
        ))}
      </div>

      {/* Actions Section Shimmer */}
      <div className="p-6 border-t border-gray-800/50">
        <div className="h-12 w-full bg-gray-800/50 rounded-tl-3xl rounded-br-3xl animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-yellow-400/20 to-gray-800 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

// Add custom keyframes in your CSS or via a styled-jsx/global style
const styles = `
  @keyframes flow {
    0% {
      transform: translateX(-100%) skewX(-20deg);
    }
    100% {
      transform: translateX(100%) skewX(-20deg);
    }
  }
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

export default UserInfoShimmer;

// If using a global CSS file, add the keyframes there instead:
// src/styles/global.css
/*
@keyframes flow {
  0% { transform: translateX(-100%) skewX(-20deg); }
  100% { transform: translateX(100%) skewX(-20deg); }
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
*/