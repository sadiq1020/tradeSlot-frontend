import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-brass disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-accent-brass text-[#0E1217] font-semibold hover:bg-accent-brass-hover shadow-sm",
        secondary:
          "bg-bg-surface-elevated text-text-primary hover:bg-bg-surface-hover border border-border-hairline",
        outline:
          "border border-border-hairline bg-transparent text-text-primary hover:bg-bg-surface hover:text-text-primary",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover",
        destructive:
          "bg-accent-rust text-white hover:bg-accent-rust-hover shadow-sm",
        success:
          "bg-accent-copper text-white hover:bg-accent-copper-hover shadow-sm",
        link:
          "text-accent-brass underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
