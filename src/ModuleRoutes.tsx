import {useContext, useEffect} from "react";
import {SesionContext} from "./providers/sesion-provider";
import {Route, Routes} from "react-router-dom";
import {PermissionInterfaces} from "./utils/interfaces";
import ProductTabPage from "./pages/production_inventory/ProducTabPage";
import ProductionTabPage from "./pages/production_inventory/ProductionTabPage";
import InventoryTabPage from "./pages/production_inventory/InventoryTabPage";
import ParamsTabPage from "./pages/production_inventory/ParamsTabPage";
import SecurityTabPage from "./pages/production_inventory/SecurityTabPage";
import CQHomePage from "./pages/cost_quality/CQHomePage";
import PIHomePage from "./pages/production_inventory/PIHomePage";

// Componente para renderizar rutas según el módulo
const ModuleRoutes = () => {
  const {sesion} = useContext(SesionContext);

  const permisions = sesion?.user.permissions as PermissionInterfaces[];
  useEffect(() => {
    console.log("hola:", permisions);
  }, []);

  return (
    <Routes>
      {permisions[0].module === 1 && (
        <>
          <Route path="/product" element={<ProductTabPage />} />
          <Route path="/production" element={<ProductionTabPage />} />
          <Route path="/inventory" element={<InventoryTabPage />} />
          <Route path="/params" element={<ParamsTabPage />} />
          <Route path="/security" element={<SecurityTabPage />} />
          <Route path="/home" element={<PIHomePage />} />
        </>
      )}
      {permisions[0].module === 2 && (
        <>
          <Route path="/home" element={<CQHomePage />} />
        </>
      )}
      {permisions[0].module === 3 && (
        <>
          <Route path="/home" element={<CQHomePage />} />
        </>
      )}
      {permisions[0].module === 4 && (
        <>
          <Route path="/home" element={<CQHomePage />} />
        </>
      )}
      {permisions[0].module === 5 && (
        <>
          <Route path="/home" element={<CQHomePage />} />
        </>
      )}
    </Routes>
  );
};

export default ModuleRoutes;
