import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

const PADDING_STYLES = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-[0_4px_40px_rgba(0,36,82,0.06)] overflow-hidden ${PADDING_STYLES[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
