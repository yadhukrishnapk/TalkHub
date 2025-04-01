// src/components/Login.js
import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { auth, db, realtimeDb } from "./firebase";
import { LogIn } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { globalState } from "./jotai/globalState";
import { Navigate } from "react-router-dom";

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

      // Initialize presence data in Realtime Database
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      {/* Logo Section */}
      <div className="mb-10">
        <h1 className="text-6xl font-bold">
          <span className="text-white">Talk</span>
          <span className="text-yellow-400">Hub</span>
        </h1>
        <p className="text-gray-400 text-center mt-2">Connect and Chat With The World</p>
      </div>

      {/* Login Box */}
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-zinc-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Log In To Your Account
        </h2>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`flex items-center justify-center w-full py-4 px-6 rounded-lg transition duration-300 ${
              loading
                ? "bg-zinc-700 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
            }`}
          >
            <LogIn
              size={24}
              className={`mr-2 ${loading ? "text-zinc-400" : "text-black"}`}
            />
            <span className={loading ? "text-zinc-300" : "text-black"}>
              {loading ? "Connecting..." : "Sign in with Google"}
            </span>
          </button>
          
          {/* Premium Teaser */}
          <div className="bg-zinc-800 p-4 rounded-lg w-full">
            <p className="text-yellow-400 font-bold mb-2">⭐ TalkHub Premium</p>
            <p className="text-gray-300 text-sm">Get access to exclusive chat rooms and advanced features!</p>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-800 pt-6">
          <div className="text-center text-gray-400 text-sm">
            By signing in, you agree to our <span className="text-yellow-400 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-yellow-400 hover:underline cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default Login;