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
          <Route path="/product" element={<ProductTabPage />} />
          <Route path="/production" element={<ProductionTabPage />} />
          <Route path="/inventory" element={<InventoryTabPage />} />
          <Route path="/params" element={<ParamsTabPage />} />
          <Route path="/security" element={<SecurityTabPage />} />
          <Route path="/home" element={<PIHomePage />} />
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
