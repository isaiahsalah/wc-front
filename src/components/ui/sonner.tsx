import {useTheme} from "@/providers/themeProvider";
import {Toaster as Sonner, ToasterProps} from "sonner";

const Toaster = ({...props}: ToasterProps) => {
  const {theme} = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group text-accent"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export {Toaster};
