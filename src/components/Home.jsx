import React, { useState, useEffect } from "react";
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
import { PlusIcon, UserIcon, ArrowLeftIcon, MenuIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserInfoPanel from "./UserInfoPanel/UserInfoPanel";
import ContactsHeader from "./ContactsHeader/ContactsHeader";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { username: initialUsername } = useParams();
  const [selectedUsername, setSelectedUsername] = useState(initialUsername);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSetActiveChat = (chatId, username) => {
    setSelectedUsername(username);
    navigate(`/home/${username}`);
    setIsModalOpen(false);
    setMobileSidebarOpen(false); // Close sidebar on mobile when selecting a chat
  };

  const handleGoBack = () => {
    setSelectedUsername(null);
    navigate("/home");
  };

  // Mobile layout components
  const MobileLayout = () => (
    <div className="h-full flex flex-col bg-black">
      {selectedUsername ? (
        // Chat view when a conversation is selected
        <div className="flex flex-col h-full">
          <div className="bg-[#121212] flex items-center px-4 py-3 border-b border-gray-800">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-gray-400"
              onClick={handleGoBack}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div className="flex-1 font-medium text-white">
              {selectedUsername}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-0 w-full sm:w-80 bg-[#121212] border-l border-gray-800"
              >
                <UserInfoPanel selectedUsername={selectedUsername} />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatWindow initialUsername={selectedUsername} />
          </div>
        </div>
      ) : (
        // Contact list when no conversation is selected
        <div className="flex flex-col h-full">
          <ContactsHeader
            onAddContact={() => setIsModalOpen(true)}
            onSearch={setSearchQuery}
            userAvatar="/path/to/avatar.jpg"
          />
          <div className="flex-1 overflow-auto">
            <ChatList
              setActiveChat={handleSetActiveChat}
              searchFilter={searchQuery}
            />
          </div>
        </div>
      )}

      {/* Modal for Finding New Contacts */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="border border-gray-800 text-white max-w-md p-0 overflow-hidden rounded-xl bg-[#121212]">
          <DialogHeader className="p-4 border-b border-gray-800 bg-black">
            <DialogTitle className="text-yellow-400 text-xl font-bold">
              Find New Contacts
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <SearchBar setActiveChat={handleSetActiveChat} />
          </div>
          <div className="p-4 flex justify-end border-t border-gray-800 bg-black">
            <Button
              className="bg-gray-800 hover:bg-gray-700 text-white mr-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
              Add Selected
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Desktop layout with resizable panels
  const DesktopLayout = () => (
    <div className="h-full flex flex-col bg-black">
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Contacts Sidebar */}
          <ResizablePanel
            defaultSize={25}
            minSize={20}
            className="flex flex-col bg-[#121212]"
          >
            <ContactsHeader
              onAddContact={() => setIsModalOpen(true)}
              onSearch={setSearchQuery}
              userAvatar="/path/to/avatar.jpg"
            />
            <div className="flex-1 overflow-auto">
              <ChatList
                setActiveChat={handleSetActiveChat}
                searchFilter={searchQuery}
              />
            </div>
          </ResizablePanel>
          <ResizablePanelHandle className="bg-yellow-400 w-1" />

          {/* Chat Window */}
          <ResizablePanel
            defaultSize={50}
            minSize={40}
            className="h-full bg-[#0a0a0a]"
          >
            {selectedUsername ? (
              <ChatWindow initialUsername={selectedUsername} />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 h-full bg-black bg-opacity-80">
                <div className="p-8 rounded-xl flex flex-col items-center max-w-md text-center">
                  <div className="bg-yellow-400 h-20 w-20 rounded-full flex items-center justify-center mb-6">
                    <PlusIcon
                      onClick={() => setIsModalOpen(true)}
                      className="h-10 w-10 text-black"
                    />
                  </div>
                  <div className="text-2xl font-bold mb-2 text-white">
                    No Active Chats
                  </div>
                  <p className="text-gray-500 mb-6">
                    Start a new conversation or select an existing chat.
                  </p>
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
            <DialogTitle className="text-yellow-400 text-xl font-bold">
              Find New Contacts
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <SearchBar setActiveChat={handleSetActiveChat} />
          </div>
          <div className="p-4 flex justify-end border-t border-gray-800 bg-black">
            <Button
              className="bg-gray-800 hover:bg-gray-700 text-white mr-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
              Add Selected
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Render based on screen size
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}

export default Home;
