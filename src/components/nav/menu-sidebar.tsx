import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {Link} from "react-router-dom";
import {IMenuItem} from "@/utils/const";
const MenuSidebar = ({items, title}: {items: IMenuItem[]; title: string}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu className=" box-border">
        {items.map((item, i) =>
          !item.isActive ? null : (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton
                disabled={item.isActive}
                // className={` ${!item.isActive ? "pointer-events-none opacity-50" : ""} `}
                asChild
                //isActive={!item.isActive}
              >
                <Link to={item.url}>
                  <item.icon />
                  {item.name}{" "}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default MenuSidebar;
