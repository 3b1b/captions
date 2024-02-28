import { CSSProperties } from "react";
import classNames from "classnames";
import classes from "./Badge.module.css";

type Props = {
  /** percent */
  completion: number;
  className?: string;
};

const radius = 50;

/** percent, colored circle, content */
function Badge({ completion, className }: Props) {
  const percent = completion * 100;
  return (
    <svg
      className={classNames(classes.badge, className)}
      viewBox={[-radius, -radius, radius * 2, radius * 2].join(" ")}
      style={{ "--completion": percent + "%" } as CSSProperties}
      data-tooltip={`${percent.toFixed(2)}% reviewed or edited`}
    >
      <circle className={classes.back} r={radius} opacity={completion} />
      <text
        className={classes.text}
        y="0.1em"
        transform={completion >= 1 ? "scale(0.9)" : ""}
        fill={completion > 0.5 ? "white" : "black"}
      >
        {percent.toFixed(0)}
        <tspan opacity={0.5} fontSize="0.75em">
          %
        </tspan>
      </text>
    </svg>
  );
}

export default Badge;
