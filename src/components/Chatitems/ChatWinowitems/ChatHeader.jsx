import React from "react";
import { CardHeader } from "@/components/ui/card";
import { MessageCircleIcon } from "lucide-react";

const ChatHeader = ({ chatdet, username, isOpponentOnline, lastOnline }) => {
  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Last seen: Unknown";
    const date = new Date(timestamp);
    return `Last seen: ${date.toLocaleString()}`;
  };

  return (
    <CardHeader className="border-b border-gray-800 flex flex-row items-center justify-between h-16 min-h-[4rem] sticky top-0 z-10 bg-black px-4">
      <div className="flex items-center space-x-3">
        {chatdet.profilePic ? (
          <img
            src={chatdet.profilePic}
            alt={chatdet.chatname}
            className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border-2 border-yellow-400">
            <MessageCircleIcon className="h-6 w-6 text-yellow-400" />
          </div>
        )}
        <div className="flex flex-col">
          <div className="font-bold text-xl">
            <span className="text-white">{(chatdet.chatname || username).split(' ')[0]}</span>
            <span className="text-yellow-400">{(chatdet.chatname || username).split(' ').slice(1).join(' ')}</span>
          </div>
          <span className="text-sm">
            {isOpponentOnline ? (
              <span className="text-green-500 font-medium">● Online Now</span>
            ) : (
              <span className="text-gray-400">{formatLastSeen(lastOnline)}</span>
            )}
          </span>
        </div>
      </div>
      
      <div className="text-2xl font-bold">
        <span className="text-white">Chat</span>
        <span className="text-yellow-400">s</span>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;