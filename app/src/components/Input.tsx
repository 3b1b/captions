import { ComponentProps } from "react";
import { FaXmark } from "react-icons/fa6";
import classNames from "classnames";
import classes from "./Input.module.css";

type Props = {
  onChange: (value: string) => void;
} & Omit<ComponentProps<"input">, "onChange">;

function Input({ className, onChange, ...props }: Props) {
  return (
    <div className={classes.wrapper}>
      <input
        className={classNames(classes.input, className)}
        onChange={(event) => onChange?.(event.target.value)}
        {...props}
      />
      <button className={classes.action} onClick={() => onChange("")}>
        <FaXmark />
      </button>
    </div>
  );
}

export default Input;
