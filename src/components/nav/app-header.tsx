import {SidebarTrigger} from "../ui/sidebar";
//import { useLocation } from "react-router-dom";

import {ModeToggle} from "../mode-toggle";
import {useContext} from "react";
import {TitleContext} from "@/providers/title-provider";
import TypographyH5 from "../text/h5-text";

const Header = () => {
  //const location = useLocation();
  //const currentPath = location.pathname.replace(/^\/|\/$/g, "");
  const {title} = useContext(TitleContext);

  return (
    <header className="flex   shrink-0 items-center gap-2 border-b p-2">
      <SidebarTrigger className="-ml-1" />
      <div className=" mr-auto">
        <TypographyH5>{title}</TypographyH5>
      </div>
      <ModeToggle />
    </header>
  );
};

export default Header;
