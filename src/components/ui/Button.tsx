import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] disabled:bg-gray-200 disabled:text-gray-400",
  secondary:
    "bg-white text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-blue-50 disabled:border-gray-200 disabled:text-gray-400",
  ghost:
    "bg-white text-[var(--color-text-secondary)] border border-gray-200 hover:bg-gray-50 disabled:text-gray-300",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "py-1.5 px-3 text-xs rounded-lg",
  md: "py-2.5 px-4 text-sm rounded-xl",
  lg: "py-3 px-6 text-sm rounded-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        font-semibold transition-all active:scale-[0.98]
        disabled:cursor-not-allowed
        ${VARIANT_STYLES[variant]}
        ${SIZE_STYLES[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
