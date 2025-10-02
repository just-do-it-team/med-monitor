import React from "react";
import { cn } from "@/shared/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
    fullScreen: {
      true: "flex absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4",
      false: "flex",
    },
  },
  defaultVariants: {
    show: true,
    fullScreen: false,
  },
});

const loaderVariants = cva("animate-spin text-darkBlue", {
  variants: {
    size: {
      small: "size-6",
      medium: "size-8",
      large: "size-12",
      extraLarge: "size-48",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface SpinnerContentProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Spinner({
  size,
  show,
  fullScreen,
  children,
  className,
}: SpinnerContentProps) {
  return (
    <span className={spinnerVariants({ show, fullScreen })}>
      <Loader2 className={cn(loaderVariants({ size }), className)} />
      {children}
    </span>
  );
}
