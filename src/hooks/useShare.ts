import { useRef } from "react";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export const useShare = () => {
  const viewShotRef = useRef<ViewShot>(null);

  const openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert("Whoops! Sharing isn't available on your device!");
      return;
    }

    if (viewShotRef.current?.capture) {
      const uri = await viewShotRef.current.capture();

      const options = {
        mimeType: "image/jpeg",
        dialogTitle: "Share with Stats-va",
        UTI: "image/jpeg",
      };

      await Sharing.shareAsync(uri, options);
    }
  };

  return {
    viewShotRef,
    openShareDialog,
  };
};
