import { CSSProperties } from "react";
import { createPortal } from "react-dom";
import classes from "./ProgresBar.module.css";

type Props = {
  progress: number;
};

function ProgressBar({ progress }: Props) {
  return createPortal(
    <div
      className={classes.progress}
      style={{ "--progress": progress } as CSSProperties}
    />,
    document.body,
  );
}

export default ProgressBar;
