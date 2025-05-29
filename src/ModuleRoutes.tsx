import {useContext} from "react";
import {SesionContext} from "./providers/sesionProvider";
import {Route, Routes} from "react-router-dom";
import {IPermission} from "./utils/interfaces";
import {typeModule} from "./utils/const";
import {SectorProcessContext} from "./providers/sectorProcessProvider";

// Componente para renderizar rutas según el módulo
const ModuleRoutes = () => {
  const {sesion} = useContext(SesionContext);

  const {sectorProcess} = useContext(SectorProcessContext);

  const moduleId = (sesion?.sys_user.permissions as IPermission[])[0].type_module;
  //const permissions = sesion?.sys_user.permissions as IPermission[];
  const permissions = (sesion?.sys_user.permissions as IPermission[]).filter(
    (per) => per.sector_process?.id_process === (sectorProcess?.process?.id as number)
  );
  return (
    <Routes>
      {typeModule
        .find((mod) => mod.id === moduleId)
        ?.menu.map((menu, i) => {
          return menu.pages.map((page) => {
            const existPermission = permissions.find((per) => per.type_screen === page.id);

            if (existPermission) {
              console.log(existPermission?.type_screen);

              return (
                <Route
                  key={i}
                  path={page.link}
                  element={
                    <page.page
                      degree={existPermission.type_degree}
                      type_screen={existPermission.type_screen}
                    />
                  }
                />
              );
            } else return null;
          });
        })}
    </Routes>
  );
};

export default ModuleRoutes;
