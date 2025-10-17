import {
  CircleCheck,
  CircleX,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <CircleX className="h-4 w-4" />,
        loading: <Loader2 className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-none",
          description:
            "group-[.toast]:min-w-[250px] group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          default:
            "group-[.toaster]:bg-background group-[.toaster]:text-foreground",
          info: "group-[.toaster]:bg-blue-500",
          success: "group-[.toaster]:bg-greenColor group-[.toaster]:text-white",
          warning: "group-[.toaster]:bg-yellowColor",
          error: "group-[.toaster]:bg-redColor group-[.toaster]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
