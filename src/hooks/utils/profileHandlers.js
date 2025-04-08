import axios from "axios";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { useEffect } from "react";

// Handle image upload to Cloudinary and profile update
export const handleImageUpload = async (event, setLoading, setUser) => {
  const file = event.target.files[0];
  if (!file) return;
  console.log("File selected:", file);
  console.log("Cloudinary upload preset:", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  console.log("Cloudinary cloud name:", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
  console.log("Cloudinary upload URL:", `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`);
  console.log("Cloudinary upload form data:", {
    file,
    upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  });
  
  

  setLoading(true);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    const imageUrl = response.data.secure_url;

    await updateProfile(auth.currentUser, {
      photoURL: imageUrl,
    });

    setUser((prevUser) => ({
      ...prevUser,
      photoURL: imageUrl,
    }));

    return true; // Indicate success
  } catch (error) {
    console.error("Error uploading image or updating profile:", error);
    throw error; // Re-throw for error handling in component
  } finally {
    setLoading(false);
  }
};

// Handle mouse movement over the avatar for zoom effect
export const handleAvatarMouseMove = (e, avatarRef, setAvatarMousePosition) => {
  if (!avatarRef.current) return;
  
  const bounds = avatarRef.current.getBoundingClientRect();
  
  // Calculate relative mouse position within the avatar
  const x = ((e.clientX - bounds.left) / bounds.width) * 100;
  const y = ((e.clientY - bounds.top) / bounds.height) * 100;
  
  setAvatarMousePosition({ x, y });
};

// Handle mouse movement over the preview image for zoom effect
export const handlePreviewMouseMove = (e, previewImageRef, setPreviewMousePosition, setZoomBoxPosition, zoomBoxSize) => {
  if (!previewImageRef.current) return;
  
  const bounds = previewImageRef.current.getBoundingClientRect();
  
  // Calculate relative mouse position within the preview image
  const x = ((e.clientX - bounds.left) / bounds.width) * 100;
  const y = ((e.clientY - bounds.top) / bounds.height) * 100;
  
  setPreviewMousePosition({ x, y });
  
  // Calculate position for the zoom box
  const imageWidth = bounds.width;
  const imageHeight = bounds.height;
  
  const offsetX = 20;
  const offsetY = 20;
  
  let boxX = e.clientX - bounds.left + offsetX;
  let boxY = e.clientY - bounds.top + offsetY;
  
  // Keep the zoom box within the image boundaries
  if (boxX + zoomBoxSize.width > imageWidth) {
    boxX = e.clientX - bounds.left - zoomBoxSize.width - offsetX;
  }
  if (boxY + zoomBoxSize.height > imageHeight) {
    boxY = e.clientY - bounds.top - zoomBoxSize.height - offsetY;
  }
  
  const boxXPercent = (boxX / imageWidth) * 100;
  const boxYPercent = (boxY / imageHeight) * 100;
  
  setZoomBoxPosition({ x: boxXPercent, y: boxYPercent });
};

// Effect for positioning the avatar zoom lens
export const useAvatarZoomEffect = (isAvatarHovering, avatarMousePosition, avatarZoomRef) => {
  useEffect(() => {
    if (isAvatarHovering && avatarZoomRef.current) {
      avatarZoomRef.current.style.transformOrigin = `${avatarMousePosition.x}% ${avatarMousePosition.y}%`;
    }
  }, [avatarMousePosition, isAvatarHovering]);
};

// Effect for positioning the preview zoom lens
export const usePreviewZoomEffect = (isPreviewHovering, previewMousePosition, previewZoomRef) => {
  useEffect(() => {
    if (isPreviewHovering && previewZoomRef.current) {
      previewZoomRef.current.style.transformOrigin = `${previewMousePosition.x}% ${previewMousePosition.y}%`;
    }
  }, [previewMousePosition, isPreviewHovering]);
};

// Effect for calculating zoom indicator box size
export const useZoomBoxSizeEffect = (isPreviewOpen, isPreviewHovering, previewImageRef, setZoomBoxSize) => {
  useEffect(() => {
    if (previewImageRef.current) {
      const zoomLevel = 3;
      const bounds = previewImageRef.current.getBoundingClientRect();
      setZoomBoxSize({
        width: bounds.width / zoomLevel,
        height: bounds.height / zoomLevel
      });
    }
  }, [isPreviewOpen, isPreviewHovering]);
};