import React from "react";
import GridDistortion from "../ui/Lightning/GrayScaleImage"; 

const LightningPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
       <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        <GridDistortion
          imageSrc="https://picsum.photos/1920/1080?grayscale"
          grid={10}
          mouse={0.1}
          strength={0.15}
          relaxation={0.9}
          className="custom-class"
        />
        <button
          onClick={handleRefresh}
          className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          aria-label="Refresh page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H0m0 0v5h5.582M20 20v-5h-.582m-15.356-2A8.001 8.001 0 0019.418 15H24m0 0v-5h-5.582"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LightningPage;