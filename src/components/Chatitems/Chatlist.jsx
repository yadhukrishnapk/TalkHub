import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users, MoreVertical, Trash2, Search, Star } from "lucide-react";
import useChatList from "../../hooks/useChatlist";
import { useSetAtom } from "jotai";
import { chatdetails } from "../../jotai/globalState";
import ChatListShimmer from "../ui/Shimmers/ChatListShimmer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ref, onValue, off } from "firebase/database";
import { realtimeDb } from "../../firebase";

// Import the modified truncateMessage utility function, not the hook
import { truncateMessage } from "../../hooks/useTruncateMessage";

function ChatList({ setActiveChat }) {
  const { chatList, isLoading, deleteChat } = useChatList();
  const setChatdet = useSetAtom(chatdetails);
  const [open, setOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineStatus, setOnlineStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const listeners = [];
    if (Array.isArray(chatList)) {
      chatList.forEach((chat) => {
        const presenceRef = ref(realtimeDb, `presence/${chat.name}`);
        const listener = onValue(presenceRef, (snapshot) => {
          const data = snapshot.val();
          setOnlineStatus((prev) => ({
            ...prev,
            [chat.name]: data ? data.online : false,
          }));
        });
        listeners.push({ ref: presenceRef, listener });
      });
    }

    return () => {
      listeners.forEach(({ ref, listener }) => off(ref, "value", listener));
    };
  }, [chatList]);

  const confirmDelete = (refid, e) => {
    e.stopPropagation();
    setChatToDelete(refid);
    setOpen(true);
  };

  const handleChatSelect = (refid, name, profilePic) => {
    setActiveChat(refid, name);
    setChatdet({ chatname: name, profilePic });
    navigate(`/home/${name}`);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const filteredChats = Array.isArray(chatList)
    ? chatList.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const isVerified = (refid) => {
    return refid.charCodeAt(0) % 3 === 0;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800 relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-yellow-500 via-zinc-900 to-black transform skew-y-6"></div>
      </div>

      <Card className="rounded-none border-none shadow-none flex flex-col h-full bg-transparent relative z-10">
        <CardHeader className="border-b border-zinc-800/50 shrink-0 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col space-y-3 sm:space-y-5">
            <CardTitle className="flex items-center justify-center sm:justify-start text-white">
              <Users className="mr-2 sm:mr-3 h-6 sm:h-7 w-6 sm:w-7 text-yellow-400 animate-spin-slow" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-white font-extrabold text-xl sm:text-2xl drop-shadow-md">
                My Chats
              </span>
            </CardTitle>

            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-zinc-400 group-hover:text-yellow-400 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800/90 border border-yellow-500/30 rounded-tl-2xl sm:rounded-tl-3xl rounded-br-2xl sm:rounded-br-3xl py-2 sm:py-3 pl-9 sm:pl-12 pr-3 sm:pr-5 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400 focus:ring-1 sm:focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 placeholder-zinc-500 shadow-md shadow-zinc-800/30"
              />
              <div className="absolute inset-0 -z-10 bg-yellow-400 opacity-0 group-hover:opacity-10 rounded-tl-2xl sm:rounded-tl-3xl rounded-br-2xl sm:rounded-br-3xl transition-opacity duration-300"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {isLoading ? (
              <ChatListShimmer />
            ) : filteredChats.length > 0 ? (
              <div className="divide-y divide-zinc-800/50">
                {filteredChats.map((chat) => {
                  // Use utility function instead of hook
                  const truncatedMessageText = truncateMessage(chat.lastMessage?.text || "", 15);
                  return (
                    <TooltipProvider key={chat.refid}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            onClick={() =>
                              handleChatSelect(
                                chat.refid,
                                chat.name,
                                chat.profilePic
                              )
                            }
                            className="
                              p-5 
                              hover:bg-zinc-800/80 
                              cursor-pointer 
                              flex 
                              items-center 
                              space-x-4 
                              transition-all duration-300
                              relative
                              group
                            "
                          >
                            <div className="relative">
                              {chat.profilePic ? (
                                <img
                                  src={chat.profilePic}
                                  alt={chat.name}
                                  className="w-12 h-12 rounded-tl-2xl rounded-br-2xl object-cover border-2 border-yellow-500/30 group-hover:shadow-md group-hover:shadow-yellow-500/20 transition-all duration-300"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-tl-2xl rounded-br-2xl bg-zinc-700 flex items-center justify-center border-2 border-zinc-600">
                                  <Users className="h-6 w-6 text-zinc-300 animate-pulse" />
                                </div>
                              )}
                              <span
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-zinc-900 animate-pulse ${
                                  onlineStatus[chat.name]
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              ></span>
                            </div>

                            <div className="flex-1 overflow-hidden">
                              <div className="flex items-center justify-between">
                                <div className="font-semibold truncate text-white flex items-center text-lg">
                                  {chat.name}
                                  {isVerified(chat.refid) && (
                                    <span className="ml-2 flex items-center">
                                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 animate-spin-slow" />
                                    </span>
                                  )}
                                </div>
                                {chat.lastMessage && (
                                  <span className="text-xs text-zinc-400 font-medium">
                                    {formatTimestamp(chat.lastMessage.timestamp)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-zinc-300 truncate group-hover:text-zinc-200 transition-colors duration-300">
                                  {truncatedMessageText}
                                </p>
                                {chat.unreadCount > 0 && (
                                  <Badge className="ml-2 bg-yellow-500 text-black hover:bg-yellow-400 shadow-md shadow-yellow-500/30">
                                    {chat.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button className="p-2 text-zinc-400 hover:text-yellow-400 transition-colors duration-300">
                                  <MoreVertical className="w-6 h-6" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-zinc-900/95 border border-yellow-500/30 text-white rounded-tl-2xl rounded-br-2xl shadow-lg shadow-zinc-800/50 backdrop-blur-sm"
                              >
                                <DropdownMenuItem
                                  className="text-red-400 flex items-center hover:bg-zinc-800/80 hover:text-red-300 cursor-pointer transition-colors duration-300"
                                  onClick={(e) => confirmDelete(chat.refid, e)}
                                >
                                  <Trash2 className="w-5 h-5 mr-2 animate-bounce" />
                                  Delete Chat
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-800/90 text-white border-yellow-500/30 rounded-tl-lg rounded-br-lg shadow-md">
                          Chat with {chat.name}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center text-zinc-400 flex flex-col items-center">
                <Users className="h-14 w-14 mb-4 text-zinc-600 animate-pulse" />
                {searchQuery
                  ? "No results match your search"
                  : "No chats available yet. Start a new conversation!"}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Enhanced Delete Chat Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900/95 border border-yellow-500/40 rounded-tl-3xl rounded-br-3xl shadow-2xl shadow-zinc-800/50 backdrop-blur-md max-w-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-zinc-900 to-transparent pointer-events-none"></div>
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl font-bold text-yellow-400 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-md">
              Confirm Deletion
            </DialogTitle>
            <p className="text-zinc-300 text-sm mt-2 drop-shadow-sm">
              Are you sure you want to delete this chat? This action is
              permanent.
            </p>
          </DialogHeader>
          <DialogFooter className="relative z-10 mt-6 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-tl-2xl rounded-br-2xl px-6 py-2 transition-all duration-300 hover:shadow-md hover:shadow-yellow-500/20"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (chatToDelete) {
                  deleteChat(chatToDelete);
                }
                setOpen(false);
                navigate("/home");
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-tl-2xl rounded-br-2xl px-6 py-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 flex items-center"
            >
              <Trash2 className="w-5 h-5 mr-2 animate-pulse" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChatList;