import { ComponentProps, ReactNode } from "react";
import classNames from "classnames";
import classes from "./Button.module.css";

type Props = {
  text?: string;
  icon?: ReactNode;
} & ComponentProps<"button">;

function Button({ text, icon, className, ...props }: Props) {
  return (
    <button
      className={classNames(
        classes.button,
        icon && !text && classes.square,
        className,
      )}
      {...props}
    >
      {icon}
      {text}
    </button>
  );
}

export default Button;
