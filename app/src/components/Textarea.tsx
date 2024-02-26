import { ComponentProps, useEffect, useRef } from "react";
import classNames from "classnames";
import classes from "./Textarea.module.css";

type Props = {
  onChange: (value: string) => void;
} & Omit<ComponentProps<"textarea">, "onChange">;

function Textarea({ className, value, onChange, ...props }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  /** fit height to content */
  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.scrollHeight > ref.current.clientHeight)
      ref.current.style.height = ref.current.scrollHeight + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      className={classNames(classes.textarea, className)}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      {...props}
    />
  );
}

export default Textarea;
