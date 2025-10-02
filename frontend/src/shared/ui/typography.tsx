import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib/utils.ts";

const typographyVariants = cva("font-sans", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-3xl sm:text-4xl lg:text-5xl tracking-tight",
      h2: "scroll-m-20 border-b pb-2 text-2xl sm:text-3xl tracking-tight first:mt-0",
      h3: "scroll-m-20 text-xl sm:text-2xl tracking-tight",
      h4: "scroll-m-20 text-lg sm:text-xl tracking-tight",
      h5: "scroll-m-20 text-md sm:text-lg tracking-tight",
      p: "text-black leading-7",
      span: "text-black m-0 p-0",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    size: {
      xs: "text-[12px]",
      sm: "text-[14px]",
      md: "text-[16px]",
      lg: "text-[18px]",
      xl: "text-[24px]",
      xl2: "text-[30px]",
      xl3: "text-[40px]",
    },
  },
  defaultVariants: {
    variant: "p",
    weight: "normal",
    size: "md",
  },
});

type TypographyVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "span";

type TypographyWeight = "light" | "normal" | "medium" | "semibold" | "bold";

type TypographySize = "xs" | "sm" | "md" | "lg" | "xl" | "xl2" | "xl3";

const variantToTag: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  p: "p",
  span: "span",
};

type TypographyProps<T extends React.ElementType = "p"> = {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  size?: TypographySize;
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const Typography = <T extends React.ElementType = "p">({
  variant = "p",
  weight = "normal",
  size = "md",
  as,
  className,
  children,
  ...props
}: TypographyProps<T>) => {
  const Component: React.ElementType = as ?? variantToTag[variant] ?? "p";

  return (
    <Component
      className={cn(typographyVariants({ variant, weight, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Typography };
