import { ComponentProps } from "react";
import { FaRegSquare, FaSquareCheck } from "react-icons/fa6";
import classNames from "classnames";
import classes from "./Checkbox.module.css";

type Props = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  "data-tooltip"?: string;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

function Checkbox({
  label,
  value,
  onChange,
  "data-tooltip": tooltip,
  ...props
}: Props) {
  return (
    <label className={classes.label} data-tooltip={tooltip}>
      {value && <FaSquareCheck className={classes.icon} />}
      {!value && <FaRegSquare className={classes.icon} />}
      <input
        className={classNames(classes.checkbox, "sr-only")}
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

export default Checkbox;
