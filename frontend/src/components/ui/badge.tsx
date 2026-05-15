import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-foreground text-background",
        secondary: "border-transparent bg-muted text-foreground",
        outline: "border-border text-foreground",
        success: "border-transparent bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        warning: "border-transparent bg-amber-50 text-amber-700",
        destructive: "border-transparent bg-red-50 text-red-700",
        info: "border-transparent bg-blue-50 text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
