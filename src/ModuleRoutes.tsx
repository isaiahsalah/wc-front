import {useContext} from "react";
import {SesionContext} from "./providers/sesionProvider";
import {Route, Routes} from "react-router-dom";
import {IPermission} from "./utils/interfaces";
import {IPageItem, typeModule} from "./utils/const";
import SelectorTabPage from "./components/SelectorTabPage";

// Componente para renderizar rutas según el módulo
const ModuleRoutes = () => {
  const {sesion} = useContext(SesionContext);

  const moduleId = (sesion?.sys_user.permissions as IPermission[])[0].type_module;
  const permissions = sesion?.sys_user.permissions as IPermission[];

  return (
    <Routes>
      {typeModule
        .find((mod) => mod.id === moduleId)
        ?.menu.map((menu, i) => {
          const existPermission = menu.pages.some((page) =>
            permissions.some((per) => per.type_screen === page.id)
          );
          const tabData: IPageItem[] = menu.pages;

          if (existPermission) {
            return (
              <Route key={i} path={menu.url} element={<SelectorTabPage tabData={tabData} />} />
            );
          } else return null;
        })}
    </Routes>
  );
};

export default ModuleRoutes;
