import { ComponentProps } from "react";
import classes from "./Select.module.css";

type Props<O extends Option> = {
  /** pass with "as const" */
  options: readonly O[];
  label: string;
  value: O;
  onChange: (value: O) => void;
} & Omit<ComponentProps<"select">, "onChange">;

export type Option = string;

function Select<O extends Option>({
  label,
  options,
  value,
  onChange,
  ...props
}: Props<O>) {
  return (
    <label className={classes.label}>
      <span>{label}:</span>
      <select
        className={classes.select}
        value={value}
        onChange={(event) => onChange(event.target.value as O)}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default Select;
