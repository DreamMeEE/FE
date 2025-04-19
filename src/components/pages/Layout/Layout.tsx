import { PropsWithChildren } from "react";
import "./Layout.scss";

export function Layout({ children }: PropsWithChildren) {
  return <div className="Layout">{children}</div>;
}
