import { inactivityStorage } from "@/store/mmkv-storage";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export const UserInactivityProvider = ({ children }: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleAppStateListener = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === "background") {
        inactivityStorage.recordInactivity();
      } else if (
        nextAppState === "active" &&
        appState.current.match(/inactive|background/)
      ) {
        const startTime = inactivityStorage.getInactivity();
        const elapsed = Date.now() - startTime;
        // const minutes = Math.floor(elapsed / 60000);
        console.log("🚀 ~ showLock ", { elapsed, isSignedIn, startTime });
        if (elapsed > 3000 && isSignedIn && startTime !== 0) {
          router.replace("/(authenticated)/(modals)/lock");
        }
      }
      appState.current = nextAppState;
    },
    [isSignedIn, inactivityStorage, router]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateListener
    );

    return () => {
      subscription.remove();
    };
  }, [handleAppStateListener]);

  return children;
};
