import { SidebarTrigger } from "./ui/sidebar";
import { useLocation } from "react-router-dom";

import TypographyH4 from "./h4-text";

const Header = () => {
  const location = useLocation();

  const currentPath = location.pathname.replace(/^\/|\/$/g, "");


  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
      <SidebarTrigger className="-ml-1" />
      <div className=" mr-auto">
        <TypographyH4 data={currentPath} />
      </div>
    </header>
  );
};

export default Header;
