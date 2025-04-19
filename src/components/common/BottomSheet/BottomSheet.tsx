import { PropsWithChildren } from "react";
import "./_BottomSheet.scss";
import * as Dialog from "@radix-ui/react-dialog";

type Props = { onClickOverlay?: () => void } & PropsWithChildren;
function BottomSheetContent({ children, onClickOverlay }: Props) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay onClick={onClickOverlay} className={"DialogOverlay"} />
      <Dialog.Content className={"DialogContent"}>{children}</Dialog.Content>
    </Dialog.Portal>
  );
}

const BottomSheetRoot = (props: Dialog.DialogProps) => Dialog.Root(props);

const BottomSheet = Object.assign(BottomSheetRoot, {
  Trigger: Dialog.Trigger,
  Close: Dialog.Close,
  Content: BottomSheetContent,
});

export default BottomSheet;
