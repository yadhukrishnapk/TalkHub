import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Users, MoreVertical, Trash, Search, Star } from "lucide-react";
import useChatList from "../../hooks/useChatlist";
import { useSetAtom } from "jotai";
import { chatdetails } from "../../jotai/globalState";
import { Skeleton } from "@/components/ui/skeleton";
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

function ChatList({ setActiveChat }) {
  const { chatList, isLoading, deleteChat } = useChatList();
  const setChatdet = useSetAtom(chatdetails);
  const [open, setOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  const filteredChats = Array.isArray(chatList) ? chatList.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  
  const isVerified = (refid) => {
    return refid.charCodeAt(0) % 3 === 0;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-r border-zinc-800">
      <Card className="rounded-none border-none shadow-none flex flex-col h-full bg-zinc-900">
        <CardHeader className="border-b border-zinc-800 shrink-0 px-4 py-3 relative overflow-hidden">
          {/* Hexagon background effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-zinc-800 to-transparent transform -skew-y-12"></div>
          </div>
          
          <div className="flex flex-col space-y-4 relative z-10">
            <CardTitle className="flex items-center text-white">
              <Users className="mr-2 h-6 w-6 text-yellow-400 animate-pulse" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-white font-bold text-xl">
                My Chats
              </span>
            </CardTitle>
            
            {/* Search input with unique styling */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400 group-hover:text-yellow-400 transition-colors" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-tr-3xl rounded-bl-3xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 placeholder-zinc-500"
              />
              <div className="absolute inset-0 -z-10 bg-yellow-400 opacity-0 group-hover:opacity-10 rounded-tr-3xl rounded-bl-3xl transition-opacity duration-300"></div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {isLoading ? (
              <div className="space-y-4 p-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full bg-zinc-800" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                      <Skeleton className="h-3 w-1/2 bg-zinc-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChats.length > 0 ? (
              <div className="divide-y divide-zinc-800">
                {filteredChats.map((chat) => (
                  <TooltipProvider key={chat.refid}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          onClick={() =>
                            handleChatSelect(chat.refid, chat.name, chat.profilePic)
                          }
                          className="
                            p-4 
                            hover:bg-zinc-800 
                            cursor-pointer 
                            flex 
                            items-center 
                            space-x-3 
                            transition-colors
                            relative
                          "
                        >
                          <div className="relative">
                            {chat.profilePic ? (
                              <img
                                src={chat.profilePic}
                                alt={chat.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-zinc-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center border-2 border-zinc-600">
                                <Users className="h-5 w-5 text-zinc-300" />
                              </div>
                            )}
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-zinc-900"></span>
                          </div>

                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold truncate text-white flex items-center">
                                {chat.name}
                                {isVerified(chat.refid) && (
                                  <span className="ml-1 flex items-center">
                                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                  </span>
                                )}
                              </div>
                              {chat.lastMessage && (
                                <span className="text-xs text-zinc-400">
                                  {formatTimestamp(chat.lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-zinc-400 truncate">
                                {chat.lastMessage?.text || "Start a new conversation"}
                              </p>
                              {chat.unreadCount > 0 && (
                                <Badge className="ml-2 bg-yellow-500 text-black hover:bg-yellow-400">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <button className="p-2 text-zinc-400 hover:text-white">
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700 text-white">
                              <DropdownMenuItem
                                className="text-red-500 flex items-center hover:bg-zinc-800 cursor-pointer"
                                onClick={(e) => confirmDelete(chat.refid, e)}
                              >
                                <Trash className="w-4 h-4 mr-2" />
                                Delete Chat
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-800 text-white border-zinc-700">
                        Chat with {chat.name}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-zinc-500 flex flex-col items-center">
                <Users className="h-12 w-12 mb-3 text-zinc-700" />
                {searchQuery ? 
                  "No results match your search" : 
                  "No chats available yet. Start a new conversation!"}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-yellow-400">Delete Chat?</DialogTitle>
            <p className="text-zinc-400">This action cannot be undone.</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}
              className="text-white hover:bg-zinc-800">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (chatToDelete) {
                  deleteChat(chatToDelete);
                }
                setOpen(false);
                navigate("/home");
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChatList;