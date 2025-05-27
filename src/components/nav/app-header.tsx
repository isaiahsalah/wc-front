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
    <header className="flex   shrink-0 items-center gap-2 border-b p-2">
      <SidebarTrigger className="-ml-1" />
      <div className=" mr-auto">
        <TypographyH5>{page.name}</TypographyH5>
      </div>

      <ModeToggle />
    </header>
  );
};

export default Header;
