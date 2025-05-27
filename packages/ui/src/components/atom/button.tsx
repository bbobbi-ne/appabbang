import { type ButtonHTMLAttributes } from "react";
import { buttonVariants } from "./variants/button";

export type Props = {
  variant?: "line" | "fill";
  color?: "base" | "red" | "blue" | "white" | "ghost" | "lightGray";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  variant = "fill",
  color = "blue",
  size = "medium",
  disabled,
  className,
  children,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={`${buttonVariants({ variant, color, size, disabled })} ${className || ""}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
