// src/hooks/usePresence.js
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { globalState } from "../jotai/globalState";
import { ref, set, onDisconnect, onValue } from "firebase/database";
import { realtimeDb } from "../firebase";

const usePresence = () => {
  const user = useAtomValue(globalState);

  useEffect(() => {
    // Guard clause: Exit if user is null or doesn't have a displayName
    if (!user || !user.displayName) {
      console.log("User not available yet, skipping presence setup.");
      return;
    }

    const username = user.displayName.toLowerCase();
    const presenceRef = ref(realtimeDb, `presence/${username}`);
    const connectedRef = ref(realtimeDb, ".info/connected");

    // Initial connection check
    const unsubscribeConnected = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === true) {
        // Additional user status information for enhanced UI
        set(presenceRef, {
          online: true,
          lastOnline: null,
          status: "Available", // New field for status display
          deviceType: detectDeviceType(), // New field to show device type
          lastActivity: Date.now()
        }).catch((err) => console.error(`Failed to set online: ${err.message}`));

        onDisconnect(presenceRef)
          .set({
            online: false,
            lastOnline: Date.now(),
            status: "Offline",
            deviceType: detectDeviceType(),
            lastActivity: Date.now()
          })
          .catch((err) => console.error(`Failed to set onDisconnect: ${err.message}`));
      }
    });

    // Detect device type for presence info
    function detectDeviceType() {
      const userAgent = navigator.userAgent;
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        return "mobile";
      }
      return "desktop";
    }

    // Handle tab visibility changes with improved status
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log(`Tab active: Setting ${username} as online`);
        set(presenceRef, {
          online: true,
          lastOnline: null,
          status: "Active",
          deviceType: detectDeviceType(),
          lastActivity: Date.now()
        }).catch((err) => console.error(`Failed to set online: ${err.message}`));
      } else {
        console.log(`Tab inactive: Setting ${username} as away`);
        set(presenceRef, {
          online: true, // Still online but away
          lastOnline: null,
          status: "Away",
          deviceType: detectDeviceType(),
          lastActivity: Date.now()
        }).catch((err) => console.error(`Failed to set away: ${err.message}`));
      }
    };

    // Update last activity periodically to track user engagement
    const activityInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        set(ref(realtimeDb, `presence/${username}/lastActivity`), Date.now())
          .catch(err => console.error(`Failed to update activity: ${err.message}`));
      }
    }, 60000); // Update every minute

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      unsubscribeConnected();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(activityInterval);
      console.log(`Cleaning up presence for ${username}`);
      set(presenceRef, {
        online: false,
        lastOnline: Date.now(),
        status: "Offline",
        deviceType: detectDeviceType(),
        lastActivity: Date.now()
      }).catch((err) => console.error(`Cleanup failed: ${err.message}`));
    };
  }, [user]); // Dependency on `user`

  // Optionally return something if needed by the component
  return null;
};

export default usePresence;