import { CSSProperties, ReactNode } from "react";
import classes from "./Badge.module.css";

type Props = {
  /** percent */
  completion: number;
  /** content */
  children: ReactNode;
};

/** percent, colored circle, content */
function Badge({ completion, children }: Props) {
  return (
    <div className={classes.badge}>
      <svg
        viewBox="-50 -50 100 100"
        height="1em"
        style={{ "--completion": `${completion * 100}%` } as CSSProperties}
      >
        <circle r="50" />
      </svg>
      <span>{(completion * 100).toFixed(0).padStart(2, "0")}%</span>
      {children}
    </div>
  );
}

export default Badge;
