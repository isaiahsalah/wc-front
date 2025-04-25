import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "@/components/nav/app-sidebar";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";

import Header from "./components/nav/app-header";
import { Toaster } from "./components/ui/sonner";
import { useContext, useEffect, useState } from "react";
import { SesionContext, SesionProvider } from "./providers/sesion-provider";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { getCheckToken } from "./api/login.api";
import { SesionInterface } from "./utils/interfaces";
import LoadingPage from "./pages/LoadingPage";
import { TitleProvider } from "./providers/title-provider";
import ProductTabPage from "./pages/production_inventory/ProducTabPage";
import ProcessTabPage from "./pages/production_inventory/ProcessTabPage";
import InventoryTabPage from "./pages/production_inventory/InventoryTabPage";
import ParamsTabPage from "./pages/production_inventory/ParamsTabPage";
import SecurityTabPage from "./pages/production_inventory/SecurityTabPage";
import ProductionTabPage from "./pages/production_inventory/ProductionTabPage";

function App() {
  const PrivateRoutes = () => {
    const { setSesion } = useContext(SesionContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkToken = async () => {
        const rawToken = window.localStorage.getItem("token");

        if (!rawToken) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const savedtoken = JSON.parse(rawToken).toString();

        try {
          const response = await getCheckToken(savedtoken);

          if (response.status === 200) {
            setSesion({
              token: savedtoken,
              params: response.sesion.params,
            } as SesionInterface);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error al verificar el token:", error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };
      checkToken();
    }, [setSesion]);

    if (loading) return <LoadingPage />;

    return isAuthenticated ? (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className=" @container/main flex flex-1 flex-col gap-4 p-4 animate-fadeIn mx-4">
            <main className="h-full ">
              <Outlet />
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TitleProvider>
        <SesionProvider>
          <BrowserRouter>
            <div className=" flex h-[100vh] animate-fadeIn ">
              <Routes>
                <Route element={<PrivateRoutes />}>
                  <Route path="/product" element={<ProductTabPage />} />
                  <Route path="/production" element={<ProductionTabPage  />} />
                  <Route path="/process" element={<ProcessTabPage />} />
                  <Route path="/inventory" element={<InventoryTabPage />} />
                  <Route path="/params" element={<ParamsTabPage />} />
                  <Route path="/security" element={<SecurityTabPage />} />
                  <Route path="/*" element={<HomePage />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                {/*<Route path="*" element={<Navigate to="/login" />} />*/}
              </Routes>
            </div>
            <Toaster />
          </BrowserRouter>
        </SesionProvider>
      </TitleProvider>
    </ThemeProvider>
  );
}

export default App;
