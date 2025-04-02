import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import useChatWindow from "../../hooks/useChatwindow";
import ChatHeader from "./ChatWinowitems/ChatHeader";
import ChatMessages from "./ChatWinowitems/ChatMessages";
import NewMessagesBadge from "./ChatWinowitems/NewMessagesBadge";
import MessageInput from "./ChatWinowitems/MessageInput";
import ChatShimmerEffect from "../ui/Shimmers/ChatShimmer";

function ChatWindow({ initialUsername }) {
  const {
    username,
    activeChat,
    sendMessage,
    setNewMessage,
    newMessage,
    showEmojiPicker,
    setShowEmojiPicker,
    handleEmojiClick,
    scrollAreaRef,
    isLoading,
    chatdet,
    newMessagesCount,
    scrollToBottom,
    groupedMessages,
    formatMessageTime,
    user,
    isOpponentOnline,
    lastOnline,
    replyingTo, // New
    setReplyingTo,
  } = useChatWindow(initialUsername);

  // Handle no username selected
  if (!username) {
    return (
      <div className="flex items-center justify-center text-gray-500 h-full">
        Select a chat to start messaging
      </div>
    );
  }

  // Show shimmer effect while loading
  if (!activeChat || isLoading) {
    return <ChatShimmerEffect />;
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-full rounded-none border-none shadow-none">
        <ChatHeader
          chatdet={chatdet}
          username={username}
          isOpponentOnline={isOpponentOnline}
          lastOnline={lastOnline}
        />
        <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
          <ChatMessages
            scrollAreaRef={scrollAreaRef}
            isLoading={false} // We're handling loading state separately now
            groupedMessages={groupedMessages}
            user={user}
            formatMessageTime={formatMessageTime}
            setReplyingTo={setReplyingTo}
          />
          <NewMessagesBadge
            newMessagesCount={newMessagesCount}
            scrollToBottom={scrollToBottom}
          />
          <MessageInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            handleEmojiClick={handleEmojiClick}
            replyingTo={replyingTo} // Pass the message being replied to
            setReplyingTo={setReplyingTo} // Pass the setter to clear it
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ChatWindow;