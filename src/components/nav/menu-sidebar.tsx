import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {Link} from "react-router-dom";
import {IMenu} from "@/utils/const";
const MenuSidebar = ({items}: {items: IMenu}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{items.title}</SidebarGroupLabel>
      <SidebarMenu className="pl-2 box-border">
        {items.items.map((item, i) => (
          <SidebarMenuItem key={i}>
            <SidebarMenuButton
              className={` ${!item.isActive ? "pointer-events-none opacity-50" : ""} `}
              asChild
              //isActive={!item.isActive}
            >
              <Link to={item.url}>
                <item.icon />
                {item.title}{" "}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default MenuSidebar;
