import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-brand-off-white text-brand-black hover:bg-brand-platinum": variant === "primary" && !disabled,
            "border border-brand-off-white text-brand-off-white hover:bg-brand-charcoal": variant === "secondary" && !disabled,
            "bg-red-600 text-white hover:bg-red-700": variant === "destructive" && !disabled,
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
