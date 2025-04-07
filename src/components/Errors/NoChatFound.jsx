import React from "react";
import { MessageSquareOff } from "lucide-react";

const NoChatFound = ({ username }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0a] p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-md">
        <div className="p-4 bg-gray-900 rounded-full">
          <MessageSquareOff className="h-12 w-12 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">No conversation found</h3>
        <p className="text-gray-400">
          {username 
            ? `We couldn't find any conversation with ${username}. They might have a different username or you haven't chatted with them yet.`
            : "Select a conversation from your chat list or start a new one."}
        </p>
        <button className="mt-4 px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors">
          Start a new conversation
        </button>
      </div>
    </div>
  );
};

export default NoChatFound;