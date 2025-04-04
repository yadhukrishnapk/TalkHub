import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ChatHeader = ({ chatdet, username, isOpponentOnline, lastOnline, isOpponentTyping }) => {
  const formatLastOnline = (timestamp) => {
    if (!timestamp) return "Last seen: Unknown";
    const date = new Date(timestamp);
    return `Last seen: ${date.toLocaleString()}`;
  };

  return (
    <div className="p-4 border-b border-gray-700 bg-zinc-900 flex items-center">
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={chatdet?.photoURL} alt={username} />
        <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-white">{username}</h2>
        <p className="text-sm text-gray-400">
          {isOpponentOnline
            ? isOpponentTyping
              ? "Typing..."
              : "Online"
            : formatLastOnline(lastOnline)}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;