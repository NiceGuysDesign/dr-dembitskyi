import { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const containerVariants = cva("flex mx-auto", {
  variants: {
    variant: {
      default: "will-change-transform",
      content: "max-w-[1440px] px-3 md:px-5",
      price: "max-w-[862px]",
    },
    direction: {
      column: "flex-col",
      row: "flex-row",
    },
  },
  defaultVariants: {
    variant: "default",
    direction: "column",
  },
});

export interface ContainerProps
  extends PropsWithChildren<VariantProps<typeof containerVariants>> {
  className?: string;
}

export function Container(props: ContainerProps) {
  const { className, children, variant, direction } = props;

  return (
    <div className={cn(containerVariants({ className, variant, direction }))}>
      {children}
    </div>
  );
}
