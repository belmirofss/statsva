import { Dialog, Portal } from "react-native-paper";
import { Theme } from "../../theme";

type Props = {
  title: string;
};

export const OverlayLoading = ({ title }: Props) => {
  return (
    <Portal>
      <Dialog visible onDismiss={() => {}}>
        <Dialog.Title
          style={{ fontSize: 18, fontFamily: Theme.fonts.bold, lineHeight: 20 }}
        >
          {title}
        </Dialog.Title>
      </Dialog>
    </Portal>
  );
};
