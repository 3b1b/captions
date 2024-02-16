import { ComponentProps } from "react";
import classes from "./Checkbox.module.css";

type Props = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
} & Omit<ComponentProps<"input">, "value" | "onChange">;

function Checkbox({ label, value, onChange, ...props }: Props) {
  return (
    <label className={classes.label}>
      <input
        className={classes.checkbox}
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
