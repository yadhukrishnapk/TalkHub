import React from "react";
import { UserPlus } from "lucide-react";

const ContactsHeader = ({ onAddContact, onSearch, userAvatar }) => {
  return (
    <div className="relative p-6 space-y-4 border-b border-gray-800 bg-gradient-to-r from-[#151515] to-[#121212] overflow-hidden">
      {/* Golden Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none">
        <div
          className="w-full h-full bg-gradient-to-b from-yellow-500 via-yellow-400/50 to-transparent opacity-30 animate-pulse-slow"
          style={{
            filter: "blur(20px)",
            transform: "translateY(-20%)",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">


          {/* Title */}
          <h2 className="text-2xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-white drop-shadow-md">
            Contacts
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
      

          {/* Add Contact Button */}
          <div className="relative group">
            <button
              onClick={onAddContact}
              className="h-10 w-10 flex items-center justify-center rounded-tl-2xl rounded-br-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all duration-300 shadow-md shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50 hover:scale-110"
            >
              <UserPlus className="h-5 w-5 hover:animate-spin" />
            </button>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsHeader;