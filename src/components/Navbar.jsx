import React from "react";
import { useAtom } from "jotai";
import { globalState } from "../jotai/globalState";
import { User, LogOut, Menu, Search } from "lucide-react";
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
import { Navigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useAtom(globalState);

  const handleLogout = () => {
    <Navigate to="/" replace />;
    setUser(null);
  };

  return (
    <nav className="bg-black border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl md:text-3xl">
            <span className="text-white">Talk</span>
            <span className="text-yellow-400">Hub</span>
          </span>
        </div>


        <div className="flex items-center gap-2">
          {/* Upgrade to Premium Button */}
          <Button className="hidden md:flex bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
            ⭐ PREMIUM
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-zinc-900 border-zinc-800">
                <div className="flex flex-col space-y-4 pt-6">
                  {/* Mobile Search */}
                  <div className="relative w-full mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search chats..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  {user ? (
                    <>
                      <div className="flex flex-col items-center p-4 bg-zinc-800 rounded-lg">
                        <Avatar className="h-16 w-16 mb-2 ring-2 ring-yellow-500">
                          {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName} />
                          ) : (
                            <AvatarFallback className="bg-zinc-700 text-white">
                              <User className="h-8 w-8" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <h3 className="font-medium text-lg text-white">{user.displayName}</h3>
                        <p className="text-sm text-zinc-400">
                          {user.email}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
                          ⭐ UPGRADE TO PREMIUM
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                          className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center p-4">
                      <p className="text-zinc-400">No user logged in</p>
                    </div>
                  )}
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
                    className="flex items-center gap-2 p-1 px-2 h-auto text-white hover:bg-zinc-800"
                  >
                    <Avatar className="h-8 w-8 ring-1 ring-yellow-500">
                      {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                      ) : (
                        <AvatarFallback className="bg-zinc-700 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="font-medium">{user.displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-white">
                  <DropdownMenuLabel className="text-yellow-400">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <div className="px-2 py-1.5">
                    <p className="text-sm text-zinc-400 break-words">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    className="focus:bg-zinc-800 cursor-pointer text-yellow-400"
                  >
                    ⭐ Upgrade to Premium
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:bg-zinc-800 focus:text-red-500 cursor-pointer"
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
  );
}

export default Navbar;