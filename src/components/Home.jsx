import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizablePanelHandle,
} from "@/components/ui/resizable";
import ChatList from "./Chatitems/Chatlist";
import SearchBar from "./Chatitems/Searchbar";
import ChatWindow from "./Chatitems/ChatWindow";
import { Button } from "@/components/ui/button";
import { PlusIcon, LogOutIcon, UserIcon, MailIcon, ShieldCheckIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import UserInfoPanel from "./UserInfoPanel/UserInfoPanel";
import ContactsHeader from "./ContactsHeader/ContactsHeader";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { username: initialUsername } = useParams();
  const [selectedUsername, setSelectedUsername] = useState(initialUsername);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSetActiveChat = (chatId, username) => {
    setSelectedUsername(username);
    navigate(`/home/${username}`);
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Contacts Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} className="flex flex-col bg-[#121212]">
          <ContactsHeader
  onAddContact={() => setIsModalOpen(true)}
  onSearch={setSearchQuery}
  userAvatar="/path/to/avatar.jpg" // Or pass a state variable
/>
            <div className="flex-1 overflow-auto">
              <ChatList setActiveChat={handleSetActiveChat} searchFilter={searchQuery} />
            </div>
          </ResizablePanel>
          <ResizablePanelHandle className="bg-yellow-400 w-1" />
          
          {/* Chat Window */}
          <ResizablePanel defaultSize={50} minSize={40} className="h-full bg-[#0a0a0a]">
            {selectedUsername ? (
              <ChatWindow initialUsername={selectedUsername} />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 h-full bg-black bg-opacity-80">
                <div className="p-8 rounded-xl flex flex-col items-center max-w-md text-center">
                  <div className="bg-yellow-400 h-20 w-20 rounded-full flex items-center justify-center mb-6">
                    <PlusIcon className="h-10 w-10 text-black" />
                  </div>
                  <div className="text-2xl font-bold mb-2 text-white">No Active Chats</div>
                  <p className="text-gray-500 mb-6">Start a new conversation or select an existing chat.</p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black border-0 rounded-full px-6 py-2 font-semibold"
                  >
                    Find Someone Now
                  </Button>
                </div>
              </div>
            )}
          </ResizablePanel>
          <ResizablePanelHandle className="bg-yellow-400 w-1" />
          
          {/* User Info Panel */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <UserInfoPanel selectedUsername={selectedUsername} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Modal for Finding New Contacts */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border border-gray-800 text-white max-w-md p-0 overflow-hidden rounded-xl bg-[#121212]">
          <DialogHeader className="p-4 border-b border-gray-800 bg-black">
            <DialogTitle className="text-yellow-400 text-xl font-bold">Find New Contacts</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <SearchBar setActiveChat={handleSetActiveChat} />
          </div>
          <div className="p-4 flex justify-end border-t border-gray-800 bg-black">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white mr-2" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium">Add Selected</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Home;
