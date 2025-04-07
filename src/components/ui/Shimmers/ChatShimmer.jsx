import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react"; // Optional: for an error icon
import SomethingWentWrong from "../../Errors/SomethingWentwrong";

const ChatShimmerEffect = () => {
  const [showShimmer, setShowShimmer] = useState(true);

  // Set up a timer to switch from shimmer to error after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowShimmer(false);
    }, 8000); // 8000ms = 8 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs once on mount

  // Shimmer UI (same as your original)
  const ShimmerUI = () => (
    <div className="flex flex-col h-full bg-zinc-950 animate-pulse">
      {/* Shimmer for header */}
      <div className="h-16 px-4 border-b border-gray-800 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-800 mr-3"></div>
        <div className="flex flex-col space-y-2 flex-1">
          <div className="h-4 bg-gray-800 rounded w-1/4"></div>
          <div className="h-3 bg-gray-800 rounded w-2/5 opacity-70"></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-800"></div>
      </div>

      {/* Shimmer for messages */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="flex justify-center my-4">
          <div className="h-6 bg-gray-800 rounded-full w-24"></div>
        </div>
        <div className="flex mb-6">
          <div className="flex flex-col max-w-[70%]">
            <div className="h-12 bg-gray-800 rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md mb-1"></div>
            <div className="h-2 bg-gray-800 rounded w-10 ml-2 opacity-50"></div>
          </div>
        </div>
        <div className="flex justify-end mb-6">
          <div className="flex flex-col items-end max-w-[70%]">
            <div className="h-10 bg-gray-700 rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md mb-1"></div>
            <div className="h-2 bg-gray-800 rounded w-16 mr-2 opacity-50"></div>
          </div>
        </div>
        <div className="flex mb-6">
          <div className="flex flex-col max-w-[70%]">
            <div className="h-16 bg-gray-800 rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md mb-1"></div>
            <div className="h-2 bg-gray-800 rounded w-10 ml-2 opacity-50"></div>
          </div>
        </div>
        <div className="flex justify-end mb-6">
          <div className="flex flex-col items-end max-w-[70%]">
            <div className="h-20 bg-gray-700 rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md mb-1"></div>
            <div className="h-2 bg-gray-800 rounded w-16 mr-2 opacity-50"></div>
          </div>
        </div>
        <div className="flex justify-center my-4">
          <div className="h-6 bg-gray-800 rounded-full w-24"></div>
        </div>
        <div className="flex mb-6">
          <div className="flex flex-col max-w-[70%]">
            <div className="h-8 bg-gray-800 rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md mb-1"></div>
            <div className="h-2 bg-gray-800 rounded w-10 ml-2 opacity-50"></div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col items-end max-w-[70%]">
            <div className="h-14 bg-gray-700 rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md mb-1"></div>
            <div className="h-2 bg-gray-800 rounded w-16 mr-2 opacity-50"></div>
          </div>
        </div>
      </div>

      {/* Shimmer for input area */}
      <div className="p-4 border-t border-gray-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-800"></div>
        <div className="flex-1 h-12 bg-gray-800 rounded-xl"></div>
        <div className="w-20 h-12 bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  );



  // Conditionally render shimmer or error based on state
  return showShimmer ? <ShimmerUI /> : <SomethingWentWrong />;
};

export default ChatShimmerEffect;