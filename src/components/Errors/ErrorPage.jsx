import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Home, Frown, RefreshCw, Coffee, Bug, Lightbulb } from "lucide-react";

function ErrorPage() {
  const navigate = useNavigate();
  const [funnyQuote, setFunnyQuote] = useState("");
  const [isExploding, setIsExploding] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Collection of funny error messages
  const funnyQuotes = [
    "Looks like our chat got lost on its way to your screen.",
    "Error 404: Conversation not found. It probably went for coffee.",
    "Our server is having an existential crisis right now.",
    "This page went on vacation without telling anyone.",
    "You've reached the edge of the internet. Turn back now!",
    "The chat you're looking for is in another castle.",
    "Oops! We accidentally fed this page to the digital dogs.",
    "Houston, we have a problem. The page isn't responding to our messages.",
    "This page is playing hide and seek. And it's winning.",
    "We searched high and low, but this page is being socially distant."
  ];

  // Random error codes that look technical but are just funny
  const errorCode = `ERR_${Math.floor(Math.random() * 999)}_CHAT_NOT_FOUND`;

  useEffect(() => {
    // Select a random funny quote
    const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
    setFunnyQuote(randomQuote);

    // Rotate the 404 text slightly every few seconds
    const rotateInterval = setInterval(() => {
      setRotation(prev => (Math.random() > 0.5 ? prev + 2 : prev - 2));
    }, 2000);

    return () => clearInterval(rotateInterval);
  }, []);

  const handleExplode = () => {
    setIsExploding(true);
    setTimeout(() => setIsExploding(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-4 overflow-hidden">
      {/* Floating elements in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-yellow-500/20 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              transform: `scale(${Math.random() * 1.5 + 0.5})`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          >
            {Math.random() > 0.5 ? '404' : '?!'}
          </div>
        ))}
      </div>

      <div className="relative max-w-2xl w-full mx-auto">
        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>

        {/* Main Card */}
        <div className="relative bg-zinc-900/95 border border-zinc-800 rounded-tl-3xl rounded-br-3xl p-8 shadow-2xl shadow-zinc-800/50 backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-zinc-900 to-transparent pointer-events-none"></div>
          
          {/* Playful decoration */}
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
            <div className="relative">
              <Coffee className="w-12 h-12 text-yellow-500/30 animate-bounce" style={{ animationDuration: '3s' }} />
              <div className="absolute top-0 left-0 w-full h-full bg-yellow-500/10 blur-xl rounded-full"></div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4">
            <Bug className="w-16 h-16 text-yellow-500/20 animate-spin-slow" />
          </div>
          
          <div className="relative z-10 text-center">
            {/* Animated Logo */}
            <div className="flex justify-center mb-6">
              <div 
                className={`relative w-20 h-20 flex items-center justify-center cursor-pointer transition-transform ${isExploding ? 'scale-150' : 'hover:scale-110'}`}
                onClick={handleExplode}
              >
                <div className="absolute inset-0 bg-yellow-400 rounded-lg transform rotate-45 animate-spin-slow"></div>
                <span className="relative font-bold text-2xl text-black z-10">
                  {isExploding ? '💥' : '404'}
                </span>
                {isExploding && (
                  <>
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-500 rounded-full animate-explode"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          transform: `rotate(${i * 36}deg) translateY(-30px)`
                        }}
                      ></div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Error Message with changing angle */}
            <div 
              className="transform transition-transform duration-1000 ease-in-out" 
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-white mb-4">
                404
              </h1>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Frown className="w-6 h-6 text-yellow-400 animate-pulse" />
              Page Not Found
              <Frown className="w-6 h-6 text-yellow-400 animate-pulse" />
            </h2>
            
            {/* Technical-looking but funny error code */}
            <div className="bg-zinc-800/50 py-1 px-3 rounded-full inline-block mb-4">
              <code className="text-xs text-yellow-400">{errorCode}</code>
            </div>
            
            <p className="text-zinc-100 mb-8 max-w-md mx-auto animate-bounce">
              {funnyQuote}
            </p>

            {/* Did You Know section */}
            <div className="bg-zinc-800/30 p-4 rounded-lg mb-8 max-w-md mx-auto">
              <div className="flex items-center mb-2">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                <h3 className="text-yellow-400 font-medium">Did you know?</h3>
              </div>
              <p className="text-sm text-zinc-400 italic">
                The first 404 error was discovered in 1996 when a developer spilled coffee on a server, and the page went to get a towel but never came back.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/home")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-tl-2xl rounded-br-2xl transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/40 hover:scale-105 flex items-center group"
              >
                <Home className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Rescue Me!
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-yellow-500 text-yellow-400 hover:bg-zinc-800 hover:text-yellow-300 rounded-tl-2xl rounded-br-2xl transition-all duration-300 hover:shadow-md hover:shadow-yellow-500/20 group"
              >
                <RefreshCw className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Try Again (Why Not?)
              </Button>
            </div>
          </div>
        </div>

        {/* Footer with animated emoji */}
        <p className="text-center text-zinc-500 mt-6 text-sm flex items-center justify-center">
          TalkHub © {new Date().getFullYear()} | 
          <span className="mx-1 relative">
            <span className="absolute -top-4 left-0 animate-bounce opacity-0 hover:opacity-100 transition-opacity">
              👋
            </span>
            Where conversations connect
          </span>
        </p>
      </div>
    </div>
  );
}

// Add this CSS to your global stylesheet or component
const ErrorPageStyles = `
@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes explode {
  0% {
    opacity: 1;
    transform: rotate(0deg) translateY(0);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--rotation)) translateY(-100px);
  }
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

.animate-explode {
  animation: explode 1s forwards;
}
`;

export default ErrorPage;