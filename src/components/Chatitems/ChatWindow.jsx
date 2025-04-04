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
    replyingTo,
    setReplyingTo,
    isOpponentTyping, // New
  } = useChatWindow(initialUsername);

  if (!username) {
    return (
      <div className="flex items-center justify-center text-gray-500 h-full">
        Select a chat to start messaging
      </div>
    );
  }

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
          isOpponentTyping={isOpponentTyping} // Pass to ChatHeader
        />
        <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
          <ChatMessages
            scrollAreaRef={scrollAreaRef}
            isLoading={false}
            groupedMessages={groupedMessages}
            user={user}
            formatMessageTime={formatMessageTime}
            setReplyingTo={setReplyingTo}
            isOpponentTyping={isOpponentTyping}
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
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            chatdet={chatdet}
            username={username}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ChatWindow;