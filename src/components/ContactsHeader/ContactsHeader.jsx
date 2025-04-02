import React from "react";
import { UserPlus } from "lucide-react";

const ContactsHeader = ({ onAddContact, onSearch, userAvatar }) => {
  return (
    <div className="relative p-4 sm:p-6 space-y-3 sm:space-y-4 border-b border-gray-800 bg-gradient-to-r from-[#151515] to-[#121212] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none">
        <div
          className="w-full h-full bg-gradient-to-b from-yellow-500 via-yellow-400/50 to-transparent opacity-30 animate-pulse-slow"
          style={{
            filter: "blur(15px) blur(20px)",
            transform: "translateY(-15%)",
          }}
        ></div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-white drop-shadow-md">
            Contacts
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group">
            <button
              onClick={onAddContact}
              className="h-9 sm:h-10 w-9 sm:w-10 flex items-center justify-center rounded-tl-xl sm:rounded-tl-2xl rounded-br-xl sm:rounded-br-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all duration-300 shadow-sm sm:shadow-md shadow-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/50 hover:scale-105 sm:hover:scale-110 active:scale-95"
            >
              <UserPlus className="h-4 sm:h-5 w-4 sm:w-5 hover:animate-spin" />
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-zinc-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
              Add Contact
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsHeader;
