import React, { useCallback, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckIcon, CheckCheck, Calendar } from "lucide-react";

// Memoized TypingIndicator to prevent unnecessary re-renders
const TypingIndicator = React.memo(() => (
  <div className="flex items-start mb-2 animate-pulse">
    <div className="bg-gray-800 p-3 rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md shadow-md flex items-center space-x-2">
      <div className="flex space-x-1">
        <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
        <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
        <div className="h-2 w-2 bg-yellow-400 entfernt rounded-full animate-bounce [animation-delay:600ms]"></div>
      </div>
    </div>
  </div>
));

// Memoized Message component to optimize individual message rendering
const Message = React.memo(({ msg, user, formatMessageTime, handleReplyClick }) => {
  const isUserMessage = msg.sender === user.uid;
  const statusIcon =
    msg.status === "read" ? (
      <CheckCheck className="h-4 w-4 text-yellow-400" />
    ) : (
      <CheckIcon className="h-4 w-4 text-gray-600" />
    );

  return (
    <div
      className={`flex flex-col ${isUserMessage ? "items-end" : "items-start"} mb-2 cursor-pointer hover:bg-gray-900/50 p-2 rounded-lg transition-colors`}
      onClick={() => handleReplyClick(msg)}
      data-message-id={msg.id}
    >
      {msg.replyTo && (
        <div className="max-w-[70%] mb-1 p-2 bg-gray-700/50 rounded-md text-sm text-gray-300">
          <span className="block font-semibold text-yellow-400">
            {msg.replyTo.sender === user.uid ? "You" : "Them"}:
          </span>
          {msg.replyTo.text}
        </div>
      )}
      <div
        className={`p-3 max-w-[70%] shadow-md ${
          isUserMessage
            ? "bg-yellow-400 text-black font-medium rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md"
            : "bg-gray-800 text-white rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md"
        }`}
      >
        {msg.text}
      </div>
      <div
        className={`text-xs text-gray-500 flex items-center space-x-1 mt-1 ${
          isUserMessage ? "justify-end" : "justify-start"
        }`}
      >
        <span>{formatMessageTime(msg.timestamp)}</span>
        {isUserMessage && <div className="flex space-x-0.5">{statusIcon}</div>}
      </div>
    </div>
  );
});

// Memoized DateHeader to avoid re-rendering unchanged dates
const DateHeader = React.memo(({ date, formatDate }) => (
  <div className="flex items-center justify-center my-6">
    <div className="bg-gray-900 px-6 py-2 rounded-full shadow-md flex items-center space-x-2 border border-gray-800">
      <Calendar className="h-4 w-4 text-yellow-400" />
      <span className="text-gray-300 font-medium">{formatDate(date)}</span>
    </div>
  </div>
));

const ChatMessages = ({
  scrollAreaRef,
  isLoading,
  groupedMessages,
  user,
  formatMessageTime,
  setReplyingTo,
  isOpponentTyping,
}) => {
  // Optimized date formatting function with caching
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Memoized reply handler
  const handleReplyClick = useCallback((msg) => setReplyingTo(msg), [setReplyingTo]);

  // Optimized scrolling function
  const scrollToBottom = useCallback(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "auto",
      });
    }
  }, [scrollAreaRef]);

  // Scroll to bottom on mount or when messages/typing status change
  useEffect(() => {
    if (!isLoading) {
      requestAnimationFrame(scrollToBottom);
    }
  }, [groupedMessages, isOpponentTyping, isLoading, scrollToBottom]);

  // Render logic
  const content = isLoading ? (
    Array.from({ length: 5 }, (_, index) => (
      <Skeleton key={index} className="h-10 w-3/4 bg-gray-800 mb-2" />
    ))
  ) : (
    <>
      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
        <React.Fragment key={date}>
          <DateHeader date={date} formatDate={formatDate} />
          {dayMessages.map((msg) => (
            <Message
              key={msg.id}
              msg={msg}
              user={user}
              formatMessageTime={formatMessageTime}
              handleReplyClick={handleReplyClick}
            />
          ))}
        </React.Fragment>
      ))}
      {isOpponentTyping && <TypingIndicator />}
      <div id="chat-bottom-anchor" className="h-1" />
    </>
  );

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex-1 p-4 overflow-auto relative bg-[#0a0a0a]"
    >
      <div className="space-y-3 pb-4">{content}</div>
    </ScrollArea>
  );
};

export default React.memo(ChatMessages);