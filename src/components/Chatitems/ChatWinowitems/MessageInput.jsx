import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Smile, ArrowUpCircle, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
  newMessage,
  setNewMessage,
  sendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  replyingTo,
  setReplyingTo,
  chatdet, // Add chatdet prop
  username, // Add username prop
}) => {
  // Track typing activity
  useEffect(() => {
    if (newMessage) {
      console.log("User typing:", { chatdet, username });
    }
  }, [newMessage, chatdet, username]);

  return (
    <div className="p-4 border-t border-gray-700 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-yellow-500/10 via-zinc-900/5 to-transparent"></div>
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>

      {/* Display the message being replied to */}
      {replyingTo && (
        <div className="mb-2 p-3 bg-gray-800 rounded-lg flex items-center justify-between">
          <div>
            <span className="block text-sm text-yellow-400 font-semibold">
              Replying to {replyingTo.sender === "You" ? "yourself" : "them"}:
            </span>
            <span className="text-white text-sm">{replyingTo.text}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setReplyingTo(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center relative z-10 gap-3">
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-yellow-500 hover:text-yellow-400 hover:bg-zinc-800 rounded-full transition-all duration-300 group relative"
            >
              <Smile className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="w-auto p-0 border border-zinc-800 bg-zinc-950 shadow-lg shadow-yellow-500/20 rounded-xl"
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} theme="dark" className="border-none" />
          </PopoverContent>
        </Popover>

        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            className="
              w-full px-5 py-3 text-white bg-zinc-900 border border-zinc-800 
              rounded-tl-2xl rounded-br-2xl 
              focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 
              transition-all duration-300 
              placeholder-zinc-500 text-sm
              group-hover:border-yellow-500/50
              shadow-sm shadow-black/50
            "
          />
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>

        <Button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="
            relative overflow-hidden group
            flex items-center justify-center px-4 py-2.5 
            rounded-tl-xl rounded-br-xl bg-yellow-500 hover:bg-yellow-600 
            text-zinc-900 font-medium 
            transition-all duration-300 
            disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed
            hover:shadow-md hover:shadow-yellow-500/20
          "
        >
          <span className="absolute inset-0 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          <ArrowUpCircle className="mr-2 h-5 w-5 relative transition-transform duration-300 group-hover:-translate-y-1" />
          <span className="relative text-sm font-semibold">Send</span>
        </Button>
      </div>

      {newMessage.length > 0 && (
        <div className="flex justify-end mt-1 pr-2">
          <span className={`text-xs ${newMessage.length > 500 ? "text-yellow-500" : "text-zinc-500"} transition-colors duration-300`}>
            {newMessage.length} / 1000
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;