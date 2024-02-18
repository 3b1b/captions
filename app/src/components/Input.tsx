import { ComponentProps } from "react";
import classNames from "classnames";
import classes from "./Input.module.css";

type Props = {
  onChange: (value: string) => void;
} & Omit<ComponentProps<"input">, "onChange">;

function Input({ className, onChange, ...props }: Props) {
  return (
    <input
      className={classNames(classes.input, className)}
      onChange={(event) => onChange?.(event.target.value)}
      {...props}
    />
  );
}

export default Input;
