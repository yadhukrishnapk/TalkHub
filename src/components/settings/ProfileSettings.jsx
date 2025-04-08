import React, { useRef, useState, useEffect } from "react";
import { useAtom } from "jotai";
import { globalState } from "../../jotai/globalState";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { User, ArrowLeft, Camera, X, Check, Circle, Square } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Cropper from "react-easy-crop";
import {
  handleImageUpload,
  handleAvatarMouseMove,
  handlePreviewMouseMove,
  useAvatarZoomEffect,
  usePreviewZoomEffect,
  useZoomBoxSizeEffect,
  getCroppedImg
} from "../../hooks/utils/profileHandlers";

function ProfileSettings() {
  const [user, setUser] = useAtom(globalState);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // States for avatar hover zoom
  const [isAvatarHovering, setIsAvatarHovering] = useState(false);
  const [avatarMousePosition, setAvatarMousePosition] = useState({ x: 0, y: 0 });
  const avatarRef = useRef(null);
  const avatarZoomRef = useRef(null);
  
  // States for preview image hover zoom
  const [isPreviewHovering, setIsPreviewHovering] = useState(false);
  const [previewMousePosition, setPreviewMousePosition] = useState({ x: 0, y: 0 });
  const [zoomBoxPosition, setZoomBoxPosition] = useState({ x: 0, y: 0 });
  const previewImageRef = useRef(null);
  const previewZoomRef = useRef(null);
  const [zoomBoxSize, setZoomBoxSize] = useState({ width: 80, height: 80 });

  // Image cropping states
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropShape, setCropShape] = useState("rect"); // Default to rectangular crop

  const handleBack = () => {
    navigate("/home");
  };

  // Handle file selection
  const onFileSelected = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // Handle cropping completion
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Handle crop confirmation
  const handleCropConfirm = async () => {
    try {
      setLoading(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, cropShape);
      await handleImageUpload(croppedImage, setLoading, setUser);
      setIsCropperOpen(false);
      setImageSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error processing cropped image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle crop cancellation
  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Toggle crop shape
  const toggleCropShape = () => {
    setCropShape(prevShape => prevShape === "rect" ? "round" : "rect");
  };

  const onAvatarMouseMove = (e) => {
    handleAvatarMouseMove(e, avatarRef, setAvatarMousePosition);
  };

  const onPreviewMouseMove = (e) => {
    handlePreviewMouseMove(
      e, 
      previewImageRef, 
      setPreviewMousePosition, 
      setZoomBoxPosition, 
      zoomBoxSize
    );
  };

  // Use the imported effects
  useAvatarZoomEffect(isAvatarHovering, avatarMousePosition, avatarZoomRef);
  usePreviewZoomEffect(isPreviewHovering, previewMousePosition, previewZoomRef);
  useZoomBoxSizeEffect(isPreviewOpen, isPreviewHovering, previewImageRef, setZoomBoxSize);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No user data available. Please log in.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#121212] flex items-center px-4 py-3 border-b border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-gray-400 hover:text-white"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Account Settings</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-yellow-400 text-center">
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar with Edit Option, Preview and Zoom on Hover */}
            <div className="flex justify-center relative">
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <div 
                    className="cursor-pointer relative"
                    ref={avatarRef}
                    onMouseEnter={() => user.photoURL && setIsAvatarHovering(true)}
                    onMouseLeave={() => setIsAvatarHovering(false)}
                    onMouseMove={onAvatarMouseMove}
                  >
                    <Avatar className="h-36 w-36 ring-2 ring-yellow-500">
                      {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                      ) : (
                        <AvatarFallback className="bg-zinc-700 text-white">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    {isAvatarHovering && user.photoURL && (
                      <div className="absolute left-0 top-0 w-64 h-64 pointer-events-none z-50 rounded-lg overflow-hidden shadow-xl border-2 border-yellow-500 bg-black -translate-y-full translate-x-1/4">
                        <div 
                          ref={avatarZoomRef}
                          className="w-full h-full bg-cover bg-no-repeat transform scale-200"
                          style={{ 
                            backgroundImage: `url(${user.photoURL})`,
                            transformOrigin: `${avatarMousePosition.x}% ${avatarMousePosition.y}%`
                          }}
                        />
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="p-0 border-none bg-black max-w-[90vw] max-h-[90vh] flex items-center justify-center">
                  {user.photoURL ? (
                    <div 
                      className="relative"
                      onMouseEnter={() => setIsPreviewHovering(true)}
                      onMouseLeave={() => setIsPreviewHovering(false)}
                      onMouseMove={onPreviewMouseMove}
                    >
                      <img
                        ref={previewImageRef}
                        src={user.photoURL}
                        alt="Full-size profile preview"
                        className="max-w-full max-h-[80vh] object-contain rounded-lg"
                      />
                      
                      {isPreviewHovering && user.photoURL && (
                        <div 
                          className="absolute pointer-events-none border-2 border-yellow-400 bg-yellow-400/20"
                          style={{
                            width: `${zoomBoxSize.width}px`,
                            height: `${zoomBoxSize.height}px`,
                            left: `calc(${previewMousePosition.x}% - ${zoomBoxSize.width / 2}px)`,
                            top: `calc(${previewMousePosition.y}% - ${zoomBoxSize.height / 2}px)`,
                          }}
                        />
                      )}
                      
                      {isPreviewHovering && user.photoURL && (
                        <div 
                          className="absolute pointer-events-none z-50 rounded-lg overflow-hidden shadow-xl border-2 border-yellow-500 bg-black w-80 h-80"
                          style={{
                            left: `${zoomBoxPosition.x}%`,
                            top: `${zoomBoxPosition.y}%`,
                          }}
                        >
                          <div 
                            ref={previewZoomRef}
                            className="w-full h-full bg-cover bg-no-repeat transform scale-300"
                            style={{ 
                              backgroundImage: `url(${user.photoURL})`,
                              transformOrigin: `${previewMousePosition.x}% ${previewMousePosition.y}%`
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center">
                      No image available
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-1/3 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 rounded-full p-1"
                onClick={() => fileInputRef.current.click()}
                disabled={loading}
              >
                <Camera className="h-5 w-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileSelected}
                  accept="image/*"
                  className="hidden"
                />
              </Button>
            </div>
            {loading && (
              <p className="text-center text-yellow-400 text-sm">Uploading...</p>
            )}

            {/* User Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Display Name</label>
                <p className="text-lg font-medium">{user.displayName}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">Email</label>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-zinc-400">User ID</label>
                <p className="text-lg font-medium text-zinc-500 break-all">
                  {user.uid}
                </p>
              </div>
            </div>

            {/* Back Button */}
            <Button
              onClick={handleBack}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold mt-6"
              disabled={loading}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Image Cropper Dialog */}
      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md p-0 overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-yellow-400">Crop Your Image</h2>
            <p className="text-zinc-400 text-sm">Adjust the crop area to set your profile picture</p>
          </div>
          
          <div className="relative h-96 bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape={cropShape}
                showGrid={true}
                className="h-full"
              />
            )}
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center">
              <span className="text-zinc-400 mr-2 text-sm">Zoom:</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Crop Shape Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Crop Shape:</span>
              <div className="flex space-x-2">
                <Button
                  variant={cropShape === "rect" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCropShape("rect")}
                  className={cropShape === "rect" 
                    ? "bg-yellow-500 text-black" 
                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"}
                >
                  <Square className="h-4 w-4 mr-1" />
                  Square
                </Button>
                <Button
                  variant={cropShape === "round" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCropShape("round")}
                  className={cropShape === "round" 
                    ? "bg-yellow-500 text-black" 
                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"}
                >
                  <Circle className="h-4 w-4 mr-1" />
                  Circle
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2 justify-end">
              <Button 
                variant="outline" 
                onClick={handleCropCancel}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                onClick={handleCropConfirm}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                disabled={loading}
              >
                <Check className="h-4 w-4 mr-1" />
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfileSettings;