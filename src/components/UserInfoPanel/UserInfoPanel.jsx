import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UserCircle2, FileText, Clock, Calendar, VideoOff, Maximize, Minimize, ZoomIn, ZoomOut } from "lucide-react";
import { useAtomValue } from "jotai";
import { chatdetails, globalState } from "../../jotai/globalState";
import { doc, getDoc } from "firebase/firestore";
import { db, realtimeDb } from "../../firebase";
import { ref, onValue, off } from "firebase/database";
import UserInfoShimmer from "../ui/Shimmers/UserInfoShimmer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const UserInfoPanel = ({ selectedUsername }) => {
  const currentUser = useAtomValue(globalState);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpponentOnline, setIsOpponentOnline] = useState(false);
  const [lastOnline, setLastOnline] = useState(null);
  const chatdet = useAtomValue(chatdetails);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenImageRef = useRef(null);
  const imageContainerRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalPosition, setOriginalPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!selectedUsername) {
        setLoading(false);
        return;
      }

      try {
        const usersRef = doc(db, "users", selectedUsername);
        const userDoc = await getDoc(usersRef);

        if (userDoc.exists()) {
          setSelectedUserInfo(userDoc.data());
          setSharedFiles([
            { name: "Project Proposal.pdf", date: "2025-03-28" },
            { name: "Meeting Notes.txt", date: "2025-03-30" },
          ]);
        }

        const presenceRef = ref(realtimeDb, `presence/${selectedUsername}`);
        onValue(presenceRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setIsOpponentOnline(data.online);
            setLastOnline(data.lastOnline);
          }
        });

        return () => off(presenceRef);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [selectedUsername]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isImagePopupOpen) {
      resetZoom();
    }
  }, [isImagePopupOpen]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (fullscreenImageRef.current && fullscreenImageRef.current.requestFullscreen) {
        fullscreenImageRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
    }
  };

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleString([], { hour: "2-digit", minute: "2-digit" });
  };
const handleDoubleClick = (e) => {
  if (!imageContainerRef.current) return;
  
  const rect = imageContainerRef.current.getBoundingClientRect();
  
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (scale === 1) {
    const offsetX = (x - rect.width / 2) * (2 - 1);
    const offsetY = (y - rect.height / 2) * (2 - 1);
    
    setScale(2);
    setPosition({ x: -offsetX, y: -offsetY });
  } else {
    resetZoom();
  }
};

const resetZoom = () => {
  setScale(1);
  setPosition({ x: 0, y: 0 });
  setIsDragging(false);
};

const handleMouseDown = (e) => {
  if (scale > 1) {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setOriginalPosition({ ...position });
    
    e.preventDefault();
  }
};

const handleMouseMove = (e) => {
  if (isDragging && scale > 1) {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setPosition({
      x: originalPosition.x + dx,
      y: originalPosition.y + dy
    });
        e.preventDefault();
  }
};

  const handleMouseUp = () => {
    setIsDragging(false);
  };

const zoomIn = () => {
  if (scale < 4) {
    const newScale = scale + 0.5;
    
    // When zooming in, maintain the center of the current view
    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (rect) {
      // Adjust position to keep the center point stable
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate how much the position needs to change to maintain center focus
      const scaleFactor = (newScale / scale) - 1;
      const adjustX = (centerX - position.x) * scaleFactor;
      const adjustY = (centerY - position.y) * scaleFactor;
      
      setPosition({
        x: position.x - adjustX,
        y: position.y - adjustY
      });
    }
    
    setScale(newScale);
  }
};

const zoomOut = () => {
  if (scale > 1) {
    const newScale = scale - 0.5;
    
    if (newScale === 1) {
      // Reset to center if zooming all the way out
      resetZoom();
    } else {
      const rect = imageContainerRef.current?.getBoundingClientRect();
      if (rect) {
        // Adjust position to keep the center point stable
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate how much the position needs to change to maintain center focus
        const scaleFactor = 1 - (newScale / scale);
        const adjustX = (centerX - position.x) * scaleFactor;
        const adjustY = (centerY - position.y) * scaleFactor;
        
        setPosition({
          x: position.x + adjustX,
          y: position.y + adjustY
        });
        setScale(newScale);
      }
    }
  }
};

  if (!selectedUsername) {
    return (
      <div className="bg-[#121212] text-white h-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-t from-yellow-400 to-[#121212] transform -skew-y-6"></div>
        </div>
        <div className="p-8 text-center relative z-10">
          <div className="bg-gray-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-yellow-400/20">
            <UserCircle2 className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 bg-clip-text bg-gradient-to-r from-yellow-400 to-white">
            Select a contact
          </h3>
          <p className="text-gray-500 text-sm mt-2">
            Choose a conversation to view contact details
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <UserInfoShimmer />;
  }

  return (
    <div className="bg-[#121212] text-white h-full flex flex-col relative overflow-hidden">
      {/* Subtle background effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-gray-800 to-transparent transform skew-x-12"></div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 flex flex-col items-center border-b border-gray-800 relative z-10">
        <Dialog open={isImagePopupOpen} onOpenChange={setIsImagePopupOpen}>
          <DialogTrigger asChild>
            <div className="w-24 h-24 rounded-tl-3xl rounded-br-3xl bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg shadow-yellow-400/30 group relative cursor-pointer">
              {chatdet.profilePic ? (
                <img
                  src={chatdet.profilePic}
                  alt={chatdet.chatname}
                  className="w-24 h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <UserCircle2 className="w-12 h-12 text-yellow-400 animate-spin-slow" />
              )}
              <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
          </DialogTrigger>
          <DialogContent className="p-0 border-none bg-black max-w-[90vw] max-h-[90vh] flex flex-col items-center justify-center">
            {chatdet.profilePic ? (
              <div ref={fullscreenImageRef} className="relative w-full h-full flex items-center justify-center">
                <div 
                  ref={imageContainerRef}
                  className="overflow-hidden relative w-full h-[80vh] flex items-center justify-center cursor-move"
                  onDoubleClick={handleDoubleClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    src={chatdet.profilePic}
                    alt={chatdet.chatname}
                    className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-200"
                    style={{
                      transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                      transformOrigin: 'center'
                    }}
                    draggable="false"
                  />
                </div>
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <button 
                    onClick={zoomOut}
                    disabled={scale <= 1}
                    className={`bg-black bg-opacity-60 p-2 rounded-full transition-all duration-200 text-white ${scale > 1 ? 'hover:bg-opacity-80 hover:shadow-md hover:shadow-yellow-400/20' : 'opacity-50 cursor-not-allowed'}`}
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={zoomIn}
                    disabled={scale >= 4}
                    className={`bg-black bg-opacity-60 p-2 rounded-full transition-all duration-200 text-white ${scale < 4 ? 'hover:bg-opacity-80 hover:shadow-md hover:shadow-yellow-400/20' : 'opacity-50 cursor-not-allowed'}`}
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="bg-black bg-opacity-60 p-2 rounded-full hover:bg-opacity-80 transition-all duration-200 text-white hover:shadow-md hover:shadow-yellow-400/20"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? 
                      <Minimize className="w-5 h-5" /> : 
                      <Maximize className="w-5 h-5" />
                    }
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 px-3 py-1 rounded-full text-xs text-white">
                  {scale === 1 ? 'Double-click to zoom' : `${Math.round(scale * 100)}%`}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center">No image available</div>
            )}
          </DialogContent>
        </Dialog>
        <h3 className="text-2xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-white">
          {chatdet.chatname || "Unknown User"}
        </h3>
        <div className="w-full mt-4 bg-gray-900 p-3 rounded-lg shadow-md shadow-gray-800/50">
          <div className="text-xs text-gray-500 flex justify-between">
            <span>Status</span>
            {!isOpponentOnline && <span>Last seen</span>}
          </div>
          <div className="flex justify-between items-center mt-1">
            <span
              className={`text-sm font-medium flex items-center ${
                isOpponentOnline ? "text-green-500" : "text-gray-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1 ${
                  isOpponentOnline ? "bg-green-500" : "bg-gray-400"
                } animate-pulse`}
              ></span>
              {isOpponentOnline ? "Online" : "Offline"}
            </span>
            {!isOpponentOnline && (
              <span className="text-gray-400 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1 animate-spin-slow" />
                {formatLastSeen(lastOnline)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Shared Files Section */}
      <div className="flex-1 overflow-auto p-6 relative z-10">
        <h4 className="text-yellow-400 font-semibold mb-4 flex items-center text-lg">
          <FileText className="w-5 h-5 mr-2 " />
          Shared Files
        </h4>

        {sharedFiles.length > 0 ? (
          <div className="space-y-3">
            {sharedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-tr-2xl rounded-bl-2xl p-4 flex items-center transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-yellow-400/20 group"
              >
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate group-hover:text-yellow-400 transition-colors duration-300">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1 animate-pulse" />
                    {file.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-6">
            No shared files yet
          </div>
        )}
      </div>

      {/* Chat Actions Section */}
      <div className="p-6 border-t border-gray-800 relative z-10">
        <Button
          className="
            w-full bg-yellow-400 text-black font-medium flex items-center justify-center 
            py-3 rounded-tl-3xl rounded-br-3xl 
            opacity-50 cursor-not-allowed
            relative group
          "
          disabled={true}
        >
          <VideoOff className="w-5 h-5 mr-2" />
          Start Video Call
          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-yellow-200 bg-gray-900 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Under Development
          </span>
        </Button>
      </div>
    </div>
  );
};

export default UserInfoPanel;