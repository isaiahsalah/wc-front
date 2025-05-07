import {useContext, useEffect} from "react";
import {SesionContext} from "./providers/sesion-provider";
import {Route, Routes} from "react-router-dom";
import {IPermission} from "./utils/interfaces";
import ProductTabPage from "./pages/PI/ProducTabPage";
import ProductionTabPage from "./pages/PI/ProductionTabPage";
import InventoryTabPage from "./pages/PI/InventoryTabPage";
import ParamsTabPage from "./pages/PI/ParamsTabPage";
import SecurityTabPage from "./pages/PI/SecurityTabPage";
import CQHomePage from "./pages/CQ/CQHomePage";
import PIHomePage from "./pages/PI/PIHomePage";

// Componente para renderizar rutas según el módulo
const ModuleRoutes = () => {
  const {sesion} = useContext(SesionContext);

  const permisions = sesion?.user.permissions as IPermission[];
  useEffect(() => {
    console.log("hola:", permisions);
  }, []);

  return (
    <Routes>
      {permisions[0].type_module === 1 && (
        <>
          {permisions.some((permision) => permision.screen === 1) ? (
            <Route path="/product" element={<ProductTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen === 2) ? (
            <Route path="/production" element={<ProductionTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen === 3) ? (
            <Route path="/inventory" element={<InventoryTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen === 4) ? (
            <Route path="/params" element={<ParamsTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen === 5) ? (
            <Route path="/security" element={<SecurityTabPage />} />
          ) : null}
          {permisions.some((permision) => permision.screen === 6) ? (
            <Route path="/home" element={<PIHomePage />} />
          ) : null}
        </>
      )}
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
      )}
    </Routes>
  );
};

export default ModuleRoutes;
