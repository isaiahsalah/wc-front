import {useContext} from "react";
import {SesionContext} from "./providers/sesionProvider";
import {Route, Routes} from "react-router-dom";
import {IPermission} from "./utils/interfaces";
import {IPageItem, typeModule} from "./utils/const";
import SelectorTabPage from "./components/SelectorTabPage";

// Componente para renderizar rutas según el módulo
const ModuleRoutes = () => {
  const {sesion} = useContext(SesionContext);

  const moduleId = (sesion?.user.permissions as IPermission[])[0].type_module;
  const permissions = sesion?.user.permissions as IPermission[];

  return (
    <Routes>
      {typeModule
        .find((mod) => mod.id === moduleId)
        ?.menu.map((menu, i) => {
          const existPermission = menu.pages.some((page) =>
            permissions.some((per) => per.screen === page.id)
          );
          const tabData: IPageItem[] = menu.pages;

          if (existPermission)
            return (
              <Route key={i} path={menu.url} element={<SelectorTabPage tabData={tabData} />} />
            );
          else return null;
        })}

      {/*permisions[0].type_module === 1 && (
        <> 
          {permisions.some((permision) => permision.screen >= 1 && permision.screen <= 10) ? (
            <Route path="/product" element={<ProductTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen >= 10 && permision.screen <= 20) ? (
            <Route path="/production" element={<ProductionTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen >= 20 && permision.screen <= 30) ? (
            <Route path="/inventory" element={<InventoryTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen >= 30 && permision.screen <= 40) ? (
            <Route path="/params" element={<ParamsTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen >= 40 && permision.screen <= 50) ? (
            <Route path="/security" element={<SecurityTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen === 100) ? (
            <Route path="/home" element={<PIHomePage />} />
          ) : null}
        </>
      )
      
      }
      {permisions[0].type_module === 2 && (
        <>
          <Route path="/home" element={<CQHomePage />} />
        </>
      )}
      {permisions[0].type_module === 3 && (
        <>
          <Route path="/home" element={<CQHomePage />} />
        </>
      )}
      {permisions[0].type_module === 4 && (
        <>
          <Route path="/home" element={<CQHomePage />} />
        </>
      )}
      {permisions[0].type_module === 5 && (
        <>
          <Route path="/home" element={<CQHomePage />} />
        </>
      )*/}
    </Routes>
  );
};

export default ModuleRoutes;
