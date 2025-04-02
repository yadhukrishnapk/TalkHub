import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { auth, db, realtimeDb } from "./firebase";
import { LogInIcon } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { globalState } from "./jotai/globalState";
import { Navigate } from "react-router-dom";
import Aurora from "./components/ui/Aurora";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();
  const setUser = useSetAtom(globalState);
  const user = useAtomValue(globalState);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const username = user.displayName.toLowerCase();

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          username: username,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
          chatlist: [],
        });
        await updateProfile(user, {
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }

      const presenceRef = ref(realtimeDb, `presence/${username}`);
      await set(presenceRef, {
        online: true,
        lastOnline: null,
      });

      setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    } catch (error) {
      setError(error.message || "Failed to sign in with Google");
      console.error("Google Sign-In Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-0 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2">
        <Aurora
          colorStops={["#FFD700", "#FFA500", "#FF4500"]} 
          blend={0.9} 
          amplitude={1.5} 
          speed={0.7} 
        />
      </div>

      {/* Golden Shade Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-yellow-500 via-zinc-900 to-black transform skew-y-6"></div>
      </div>

      {/* Logo Section */}
      <div className="mb-8 sm:mb-12 relative z-10 text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Talk</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 animate-pulse">Hub</span>
        </h1>
        <p className="text-gray-300 text-center mt-3 sm:mt-4 text-lg sm:text-xl font-medium drop-shadow-md">
          Connect and Chat With The World
        </p>
      </div>

      {/* Login Box */}
      <div className="bg-zinc-900/90 p-6 sm:p-10 rounded-tr-3xl sm:rounded-tr-4xl rounded-bl-3xl sm:rounded-bl-4xl shadow-2xl w-full max-w-md border border-yellow-500/40 relative z-10 overflow-hidden backdrop-blur-md">
        {/* Inner Golden Glow Effect */}
        <div className="absolute inset-0 bg-yellow-500 opacity-10 rounded-tr-3xl sm:rounded-tr-4xl rounded-bl-3xl sm:rounded-bl-4xl pointer-events-none animate-pulse-slow"></div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-white drop-shadow-md">
          Log In To Your Account
        </h2>

        {error && (
          <div className="bg-red-900/80 border border-red-700/50 text-red-100 px-4 py-3 rounded-tl-2xl sm:rounded-tl-3xl rounded-br-2xl sm:rounded-br-3xl relative mb-6 sm:mb-8 shadow-lg shadow-red-500/20 text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center space-y-6 sm:space-y-8 relative z-10">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`
              flex items-center justify-center w-full py-3 sm:py-4 px-6 sm:px-8 
              rounded-tl-2xl sm:rounded-tl-3xl rounded-br-2xl sm:rounded-br-3xl 
              transition-all duration-300 transform
              ${loading
                ? "bg-zinc-700/80 cursor-not-allowed opacity-70"
                : "bg-yellow-500 hover:bg-yellow-400 text-black font-bold hover:shadow-lg sm:hover:shadow-xl hover:shadow-yellow-500/50 hover:scale-102 sm:hover:scale-105 active:scale-98"
              }`}
          >
            <LogInIcon
              size={24}
              className={`mr-2 sm:mr-3 ${loading ? "text-zinc-400 animate-spin" : "text-black animate-bounce"}`}
            />
            <span className={`text-base sm:text-lg font-semibold ${loading ? "text-zinc-300" : "text-black"}`}>
              {loading ? "Connecting..." : "Sign in with Google"}
            </span>
          </button>

          {/* Premium Teaser */}
          <div className="bg-zinc-800/90 p-4 sm:p-5 rounded-tl-xl sm:rounded-tl-2xl rounded-br-xl sm:rounded-br-2xl w-full border border-yellow-500/30 transition-all duration-300 hover:bg-zinc-800 hover:shadow-md sm:hover:shadow-lg hover:shadow-yellow-500/40 group backdrop-blur-sm">
            <p className="text-yellow-400 font-bold mb-1 sm:mb-2 text-base sm:text-lg flex items-center">
              <span className="mr-2 text-yellow-300 group-hover:animate-spin">✨</span> TalkHub Premium
            </p>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed drop-shadow-sm">
              Unlock exclusive chat rooms and advanced features!
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 border-t border-yellow-500/20 pt-4 sm:pt-6">
          <div className="text-center text-gray-300 text-xs sm:text-sm drop-shadow-sm">
            By signing in, you agree to our{" "}
            <span className="text-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors duration-200 font-medium">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors duration-200 font-medium">
              Privacy Policy
            </span>
            <p>with Yadhukrishna</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;