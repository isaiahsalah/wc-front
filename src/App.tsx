import {SidebarInset, SidebarProvider} from "./components/ui/sidebar";
import {AppSidebar} from "@/components/nav/app-sidebar";
import {BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate} from "react-router-dom";
import {ThemeProvider} from "./providers/theme-provider";

import Header from "./components/nav/app-header";
import {Toaster} from "./components/ui/sonner";
import {useContext, useEffect, useState} from "react";
import {SesionContext, SesionProvider} from "./providers/sesion-provider";
import LoginPage from "./pages/LoginPage";
import {getCheckToken} from "./api/login.api";
import {ISesion} from "./utils/interfaces";
import LoadingPage from "./pages/LoadingPage";
import {TitleProvider} from "./providers/title-provider";
import ModuleRoutes from "./ModuleRoutes";
import {SectorProvider} from "./providers/sector-provider";

function App() {
  const PrivateRoutes = () => {
    const {setSesion} = useContext(SesionContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      checkToken();
    }, [setSesion]);

    const checkToken = async () => {
      const rawToken = window.localStorage.getItem("token-app");
      if (!rawToken) {
        setIsAuthenticated(false);
        navigate("/login");
        setLoading(false);
        return;
      }

      const savedtoken = JSON.parse(rawToken).toString();

      await getCheckToken({token: savedtoken})
        .then((response) => {
          if (response.token) {
            // Almacena el token en localStorage
            window.localStorage.setItem("token-app", JSON.stringify(response.token));
            // Actualiza la sesión en el estado
            setSesion(response as ISesion);
            setIsAuthenticated(true);
            // Navega a la ruta deseada después de iniciar sesión
            navigate("/home");
          }
        })
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    };

    if (loading) return <LoadingPage />;

    return isAuthenticated ? (
      <SectorProvider>
        <TitleProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <div className=" @container/main flex flex-1 flex-col gap-4 p-4 animate-fadeIn md:mx-4">
                <main className="h-full ">
                  <Outlet />
                </main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </TitleProvider>
      </SectorProvider>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SesionProvider>
        <BrowserRouter>
          <div className=" flex h-[100vh] animate-fadeIn ">
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/*" element={<ModuleRoutes />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              {/*<Route path="*" element={<Navigate to="/login" />} />*/}
            </Routes>
          </div>
          <Toaster />
        </BrowserRouter>
      </SesionProvider>
    </ThemeProvider>
  );
}

export default App;
