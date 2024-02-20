import { ComponentProps } from "react";
import classes from "./Select.module.css";

type Props<O extends Option> = {
  /** dropdown options */
  options: readonly O[];
  label: string;
  /** selected option id */
  value: O["id"];
  onChange: (value: O["id"]) => void;
  "data-tooltip"?: string;
} & Omit<ComponentProps<"select">, "onChange">;

export type Option = { id: string; label: string; count?: number };

function Select<O extends Option>({
  label,
  options,
  value,
  onChange,
  "data-tooltip": tooltip,
  ...props
}: Props<O>) {
  return (
    <label className={classes.label} data-tooltip={tooltip}>
      <span>{label}:</span>
      <select
        className={classes.select}
        value={value}
        onChange={(event) => onChange(event.target.value as O["id"])}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.id}>
            {option.label}{" "}
            {option.count !== undefined && `(${option.count.toLocaleString()})`}
          </option>
        ))}
      </select>
    </label>
  );
}

export default Select;
