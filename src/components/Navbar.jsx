import React, { useState } from "react";
import { useAtom } from "jotai";
import { globalState } from "../jotai/globalState";
import {
  User,
  LogOut,
  Menu,
  Search,
  Bell,
  Settings,
  Star,
  MessageSquare,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import {  useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import PremiumModal from "./ui/preminumModal/PremiumModal";

function Navbar() {
  const [user, setUser] = useAtom(globalState);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/", { replace: true });
  };

  const openPremiumModal = () => {
    setIsPremiumModalOpen(true);
  };

  const closePremiumModal = () => {
    setIsPremiumModalOpen(false);
  };

  const handleSettingsClick = () => {
    navigate("/settings"); // Navigate to settings page
  };

  console.log("user loged", user);

  return (
    <>
      <nav className="bg-gradient-to-r from-black via-zinc-900 to-black border-b border-zinc-800 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 flex items-center justify-center hover:rotate-45">
                <div className="absolute inset-0 bg-yellow-400 rounded-lg transform rotate-45"></div>
                <span className="relative font-bold text-black z-10">TP</span>
              </div>
              <span className="font-bold text-2xl md:text-3xl">
                <span className="text-white">Talk</span>
                <span
                  className="text-yellow-400"
                  style={{ animation: "pulse 5s ease-in-out infinite" }}
                >
                  Place
                </span>{" "}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Premium Button */}
            <Button
              onClick={openPremiumModal}
              className="hidden md:flex bg-gradient-to-r from-yellow-500 to-yellow-600 hover:bg-yellow-400 text-black font-bold text-sm px-3 shadow-md hover:shadow-yellow-500/20 hover:scale-105 transition-all duration-200"
            >
              <Star className="h-3.5 w-3.5 mr-1.5" /> PREMIUM
            </Button>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-zinc-800"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-72 bg-zinc-900 border-zinc-800 p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* User Profile Section */}
                    {user && (
                      <div className="p-6 bg-gradient-to-b from-zinc-800 to-zinc-900 border-b border-zinc-800">
                        <div className="flex flex-col items-center text-center">
                          <Avatar className="h-20 w-20 mb-3 ring-2 ring-yellow-500 shadow-lg">
                            {user.photoURL ? (
                              <AvatarImage
                                src={user.photoURL}
                                alt={user.displayName}
                              />
                            ) : (
                              <AvatarFallback className="bg-zinc-700 text-white">
                                <User className="h-8 w-8" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <h3 className="font-semibold text-lg text-white mb-1">
                            {user.displayName}
                          </h3>
                          <p className="text-sm text-zinc-400 mb-4">
                            {user.email}
                          </p>
                          <Button
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:bg-yellow-400 text-black font-bold"
                            onClick={openPremiumModal}
                          >
                            <Star className="h-4 w-4 mr-2" /> UPGRADE TO PREMIUM
                          </Button>
                          <Button
                           className={`w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold`}
                            onClick={handleSettingsClick} // Navigate to settings
                          ><Settings className="mr-2 h-4 w-4 text-zinc-400" />
                            Settings
                          </Button>  
                        </div>
                      </div>
                    )}

                    {/* Footer Logout Button */}
                    <div className="p-4 border-t border-zinc-800">
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full bg-red-600/30 hover:bg-red-700 flex items-center justify-center gap-2 text-red-400 hover:text-white"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 p-1 pl-2 pr-3 h-auto text-white hover:bg-zinc-800/70 rounded-full transition-all border border-transparent hover:border-zinc-700"
                    >
                      <Avatar className="h-8 w-8 ring-1 ring-yellow-500">
                        {user.photoURL ? (
                          <AvatarImage
                            src={user.photoURL}
                            alt={user.displayName}
                          />
                        ) : (
                          <AvatarFallback className="bg-zinc-700 text-white">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col items-start leading-none">
                        <span className="font-medium text-sm">
                          {user.displayName}
                        </span>
                        <span className="text-xs text-zinc-400">Online</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 bg-zinc-900 border-zinc-800 text-white p-2 rounded-xl"
                  >
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg mb-2">
                      <Avatar className="h-12 w-12 ring-1 ring-yellow-500">
                        {user.photoURL ? (
                          <AvatarImage
                            src={user.photoURL}
                            alt={user.displayName}
                          />
                        ) : (
                          <AvatarFallback className="bg-zinc-700 text-white">
                            <User className="h-6 w-6" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-xs text-zinc-400">{user.email}</p>
                      </div>
                    </div>

                    <DropdownMenuItem
                      onClick={handleSettingsClick} // Navigate to settings
                      className="focus:bg-zinc-800 cursor-pointer px-3 py-2 rounded-lg hover:bg-zinc-800"
                    >
                      <Settings className="mr-2 h-4 w-4 text-zinc-400" />
                      Account Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={openPremiumModal}
                      className="focus:bg-zinc-800 cursor-pointer px-3 py-2 rounded-lg hover:bg-zinc-800 text-yellow-400 font-medium"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Upgrade to Premium
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800 my-2" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 focus:bg-zinc-800 focus:text-red-400 cursor-pointer px-3 py-2 rounded-lg hover:bg-zinc-800"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Modal */}
      <PremiumModal isOpen={isPremiumModalOpen} onClose={closePremiumModal} />
    </>
  );
}

export default Navbar;
