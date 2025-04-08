// import axios from "axios";
// import { updateProfile } from "firebase/auth";
// import { auth } from "../../firebase";

// // Upload an image to Cloudinary and update user profile
// export const uploadImageToCloudinary = async (file, setLoading, setUser) => {
//   if (!file) return false;

//   setLoading(true);
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
//   formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

//   try {
//     const response = await axios.post(
//       `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
//       formData
//     );
//     const imageUrl = response.data.secure_url;

//     // Update Firebase Authentication profile
//     await updateProfile(auth.currentUser, {
//       photoURL: imageUrl,
//     });

//     // Update Jotai global state
//     setUser((prevUser) => ({
//       ...prevUser,
//       photoURL: imageUrl,
//     }));

//     return true; // Indicate success
//   } catch (error) {
//     console.error("Error uploading image to Cloudinary or updating profile:", error);
//     throw error; // Re-throw for error handling in the calling component
//   } finally {
//     setLoading(false);
//   }
// };