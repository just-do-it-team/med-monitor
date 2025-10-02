import { cn } from "@/shared/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-grayBackground text-grayText",
    success: "bg-greenColor text-white",
    warning: "bg-yellowColor text-black",
    error: "bg-redColor text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[14px] font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
