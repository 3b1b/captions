import { ComponentProps } from "react";
import classNames from "classnames";
import classes from "./Textarea.module.css";

type Props = {
  onChange: (value: string) => void;
} & Omit<ComponentProps<"textarea">, "onChange">;

function Textarea({ className, onChange, ...props }: Props) {
  return (
    <textarea
      className={classNames(classes.textarea, className)}
      onChange={(event) => onChange?.(event.target.value)}
      {...props}
    />
  );
}

export default Textarea;
