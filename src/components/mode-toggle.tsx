import {Moon, Sun} from "lucide-react";

import {Button} from "@/components/ui/button";

import {useTheme} from "@/providers/theme-provider";

export function ModeToggle() {
  const {setTheme, theme} = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
}
