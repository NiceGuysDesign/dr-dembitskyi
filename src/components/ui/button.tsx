import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "text-white rounded-[50px] px-5 py-[10px] min-h-[54px] h-[66px] font-inter font-medium text-base leading-[100%] tracking-[-0.01em] hover:opacity-90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-black font-inter font-medium text-base leading-[100%] tracking-[-0.01em] hover:opacity-80",
        menu: "bg-[var(--color-bg-menu-button)] text-[var(--color-text-menu)] font-inter font-semibold text-base leading-[100%] tracking-[-0.031em] rounded-[50px] w-[112px] h-[54px] min-h-[54px] px-0 gap-[10px] shadow-[3px_8px_7.7px_rgba(0,0,0,0.34)] hover:scale-105 transition-all duration-300 flex-none self-stretch flex-grow",
      },
      size: {
        default: "h-[66px] px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  // Special wrapper for menu variant
  if (variant === "menu") {
    return (
      <div className="flex flex-col items-start p-[10px] gap-[10px] min-w-[132px] min-h-[73px] bg-[var(--color-bg-menu)] rounded-[190px] shadow-[inset_3px_4px_6.1px_rgba(0,0,0,0.23)]">
        <Comp
          data-slot="button"
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        />
      </div>
    );
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
