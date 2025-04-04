import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCircle2, FileText, Clock, Calendar, VideoOff } from "lucide-react";
import { useAtomValue } from "jotai";
import { chatdetails, globalState } from "../../jotai/globalState";
import { doc, getDoc } from "firebase/firestore";
import { db, realtimeDb } from "../../firebase";
import { ref, onValue, off } from "firebase/database";

const UserInfoPanel = ({ selectedUsername }) => {
  const currentUser = useAtomValue(globalState);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpponentOnline, setIsOpponentOnline] = useState(false);
  const [lastOnline, setLastOnline] = useState(null);
  const chatdet = useAtomValue(chatdetails);
  // console.log("chatdet on info", chatdet);

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

  const formatLastSeen = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    return date.toLocaleString([], { hour: "2-digit", minute: "2-digit" });
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
    return (
      <div className="bg-[#121212] text-white h-full flex items-center justify-center">
        <div className="animate-pulse text-yellow-400 font-medium">
          Loading user information...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] text-white h-full flex flex-col relative overflow-hidden">
      {/* Subtle background effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-gray-800 to-transparent transform skew-x-12"></div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 flex flex-col items-center border-b border-gray-800 relative z-10">
        <div className="w-24 h-24 rounded-tl-3xl rounded-br-3xl bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg shadow-yellow-400/30 group relative">
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
