import React from "react";
import { Button } from "@/components/ui/button";
import { Send, Webhook } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
  newMessage,
  setNewMessage,
  sendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
}) => (
  <div className="p-4 border-t border-gray-700 bg-black relative overflow-hidden">
    {/* Subtle background effect */}
    <div className="absolute inset-0 opacity-5 pointer-events-none">
      <div className="w-full h-full bg-gradient-to-r from-yellow-500 via-gray-900 to-transparent transform skew-x-12"></div>
    </div>

    <div className="flex space-x-4 items-center relative z-10">
      {/* Emoji Picker with new icon */}
      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-yellow-500 hover:text-yellow-400 hover:bg-gray-900 rounded-full transition-all duration-300 group"
          >
            <Webhook  className="h-7 w-7 group-hover:animate-bounce" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          side="top" 
          className="w-auto p-0 border border-gray-700 bg-black shadow-lg shadow-yellow-500/20 rounded-xl"
        >
          <EmojiPicker 
            onEmojiClick={handleEmojiClick} 
            height={350} 
            theme="dark" 
            className="border-none"
          />
        </PopoverContent>
      </Popover>

      {/* Enhanced Input */}
      <div className="relative flex-1 group">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="
            w-full px-5 py-3 text-white bg-gray-900 border border-yellow-500 
            rounded-tl-3xl rounded-br-3xl 
            focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 
            transition-all duration-300 
            placeholder-gray-500 text-sm
            group-hover:shadow-md group-hover:shadow-yellow-500/20
          "
        />
        {/* Animated underline effect */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>

      {/* Send Button with new icon */}
      <Button
        onClick={sendMessage}
        disabled={!newMessage.trim()}
        className="
          flex items-center justify-center px-5 py-2.5 
          rounded-full bg-yellow-500 hover:bg-yellow-600 
          text-black font-semibold 
          transition-all duration-300 
          disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed
          hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105
        "
      >
        <Send className="mr-2 h-5 w-5 animate-pulse" />
        <span className="relative">
          Send
          <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-yellow-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Go!</span>
        </span>
      </Button>
    </div>
  </div>
);

export default MessageInput;