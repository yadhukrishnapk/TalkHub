import axios from "axios";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useEffect } from "react";

export const getCroppedImg = async (image, crop, cropShape = "rect", scale = 1) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      const pixelRatio = window.devicePixelRatio || 1;
      
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;
      
      canvas.width = cropWidth * pixelRatio;
      canvas.height = cropHeight * pixelRatio;
      
      ctx.scale(pixelRatio, pixelRatio);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (cropShape === "circle") {
        ctx.beginPath();
        const radius = Math.min(cropWidth, cropHeight) / 2;
        ctx.arc(
          cropWidth / 2,
          cropHeight / 2,
          radius,
          0,
          2 * Math.PI
        );
        ctx.clip();
      }
      
      const sourceX = (crop.x * scaleX) / scale;
      const sourceY = (crop.y * scaleY) / scale;
      const sourceWidth = (cropWidth / scale);
      const sourceHeight = (cropHeight / scale);
      
      // Draw the cropped image onto the canvas
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.95);
    } catch (error) {
      reject(error);
    }
  });
};

// Handle image upload to Cloudinary and profile update
export const handleImageUpload = async (croppedImageBlob, setLoading, setUser) => {
  if (!croppedImageBlob) return;

  setLoading(true);
  const formData = new FormData();
  formData.append("file", croppedImageBlob);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  try {
    // Upload image to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    const imageUrl = response.data.secure_url;

    // Update Firebase Authentication profile
    await updateProfile(auth.currentUser, {
      photoURL: imageUrl,
    });

    // Update Firestore user document
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(
      userDocRef,
      {
        photoURL: imageUrl,
        displayName: auth.currentUser.displayName, // Preserve existing fields
        email: auth.currentUser.email,
        uid: auth.currentUser.uid,
        updatedAt: new Date().toISOString(), // Optional: track update time
      },
      { merge: true } // Merge to avoid overwriting other fields
    );

    // Update local state
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

// Calculate aspect ratio based on dimensions
export const calculateAspectRatio = (width, height) => {
  if (!width || !height) return 1; // Default to square
  return width / height;
};