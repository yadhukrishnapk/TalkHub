import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, RefreshCw } from "lucide-react";

function SomethingWentWrong({ onRetry }) {
  const handleRetry = () => {
    if (onRetry && typeof onRetry === 'function') {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0a] text-center p-4">
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-yellow-500/20 rounded-full animate-pulse"></div>
        <MessageSquare className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-yellow-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        Something Went Wrong
      </h2>
      <p className="text-gray-400 mb-6 max-w-md">
        We couldn't load your messages. Don't worry, let's try that again!
      </p>
      <Button
        onClick={handleRetry}
        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-tl-2xl rounded-br-2xl transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/40 flex items-center"
      >
        <RefreshCw className="w-5 h-5 mr-2 animate-spin-slow" />
        Try Again
      </Button>
    </div>
  );
}

export default SomethingWentWrong;