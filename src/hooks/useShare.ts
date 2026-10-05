import { useRef } from "react";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export type ShareFormat = "jpg" | "png";

export const useShare = () => {
  const viewShotRef = useRef<ViewShot>(null);

  const openShareDialog = async (format: ShareFormat = "jpg") => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("Whoops! Sharing isn't available on your device!");
      return;
    }

    if (viewShotRef.current?.capture) {
      const uri = await viewShotRef.current.capture();
      const mimeType = format === "png" ? "image/png" : "image/jpeg";

      await Sharing.shareAsync(uri, {
        mimeType,
        dialogTitle: "Share with Stats-va",
        UTI: format === "png" ? "public.png" : "public.jpeg",
      });
    }
  };

  return {
    viewShotRef,
    openShareDialog,
  };
};
