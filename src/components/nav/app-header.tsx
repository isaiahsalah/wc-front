import {SidebarTrigger} from "../ui/sidebar";
//import { useLocation } from "react-router-dom";

import {ModeToggle} from "../mode-toggle";
import {useContext} from "react";
import TypographyH5 from "../text/h5-text";
import {PageContext} from "@/providers/pageProvider";

const Header = () => {
  //const location = useLocation();
  //const currentPath = location.pathname.replace(/^\/|\/$/g, "");
  const {page} = useContext(PageContext);

  return (
    <header className="bg-accent/50  dark:bg-background  z-10 top-0 right-0 left-0  flex shrink-0 items-center gap-2  px-2 h-12 ">
      <SidebarTrigger className="-ml-1" />
      <div className=" mr-auto">
        <TypographyH5>{page.name}</TypographyH5>
      </div>

      <ModeToggle />
    </header>
  );
};

export default Header;
