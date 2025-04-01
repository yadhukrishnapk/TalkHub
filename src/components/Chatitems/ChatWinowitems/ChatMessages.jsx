// ChatMessages.jsx
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckIcon, CheckCheck } from "lucide-react";

const ChatMessages = ({
  scrollAreaRef,
  isLoading,
  groupedMessages,
  user,
  formatMessageTime,
}) => (
  <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 overflow-auto relative" style={{ backgroundColor: "#0a0a0a" }}>
    <div className="space-y-3 pb-4">
      {isLoading ? (
        [...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-10 w-3/4 bg-gray-800" />
        ))
      ) : (
        Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            <div className="text-center text-gray-500 my-4 relative">
              <span className="bg-black px-4 relative z-10">
                {date === new Date().toDateString()
                  ? "Today"
                  : new Date(date).toLocaleDateString()}
              </span>
              <div className="absolute left-0 right-0 top-1/2 border-t border-gray-800"></div>
            </div>
            {dayMessages.map((msg) => (
              <div
                key={msg.id}
                data-message-id={msg.id}
                className={`flex flex-col ${
                  msg.sender === user.uid ? "items-end" : "items-start"
                } mb-2`}
              >
                <div
                  className={`p-3 max-w-[70%] ${
                    msg.sender === user.uid
                      ? "bg-yellow-400 text-black font-medium rounded-tr-3xl rounded-bl-3xl rounded-tl-md rounded-br-md"
                      : "bg-gray-800 text-white rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-xs text-gray-500 flex items-center space-x-1 mt-1 ${
                    msg.sender === user.uid ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{formatMessageTime(msg.timestamp)}</span>
                  {msg.sender === user.uid && (
                    <>
                      {msg.status === "read" ? (
                        <div className="flex space-x-0.5">
                          <CheckCheck className="h-4 w-4 text-yellow-400" />
                        </div>
                      ) : msg.status === "delivered" ? (
                        <div className="flex space-x-0.5">
                        <CheckIcon className="h-4 w-4 text-gray-600" />
                        </div>
                      ) : (
                        <CheckIcon className="h-4 w-4 text-gray-600" />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  </ScrollArea>
);

export default ChatMessages;