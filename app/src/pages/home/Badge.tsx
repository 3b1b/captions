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
  const percent = (completion * 100).toFixed(0).padStart(2, "0") + "%";
  return (
    <div className={classes.badge}>
      <svg
        viewBox="-50 -50 100 100"
        height="1em"
        style={{ "--completion": percent } as CSSProperties}
      >
        <circle r="50" />
      </svg>
      <span
        data-tooltip={`${percent} of lines have been edited or reviewed by at least one human`}
      >
        {percent}
      </span>
      {children}
    </div>
  );
}

export default Badge;
