import { PropsWithChildren } from "react";
import "./_Dialog.scss";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import classNames from "classnames";

function DialogContent({
  children,
  onClose,
  onAction,
  hasCancel = true,
}: { onClose?: () => void; onAction?: () => void; hasCancel?: boolean } & PropsWithChildren) {
  return (
    <AlertDialog.Portal>
      <div className="DialogContainer">
        <AlertDialog.Overlay className={"Overlay"} />
        <AlertDialog.Content className={"Content"}>
          <h2 className={"Title"}>{children}</h2>
          <div className={"Controls"}>
            {hasCancel && (
              <AlertDialog.Cancel onClick={onClose} className={classNames("Button", "Close")}>
                취소
              </AlertDialog.Cancel>
            )}
            <AlertDialog.Action
              onClick={() => {
                onAction?.();
                onClose?.();
              }}
              className={classNames("Button", "Confirm")}
            >
              닫기
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </div>
    </AlertDialog.Portal>
  );
}

const Dialog = Object.assign(AlertDialog.Root, {
  Trigger: AlertDialog.Trigger,
  Action: AlertDialog.Action,
  Cancel: AlertDialog.Cancel,
  Content: DialogContent,
});

export default Dialog;
