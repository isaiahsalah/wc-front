import {SidebarInset, SidebarProvider} from "./components/ui/sidebar";
import {AppSidebar} from "@/components/nav/app-sidebar";
import {BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate} from "react-router-dom";
import {ThemeProvider} from "./providers/themeProvider";

import Header from "./components/nav/app-header";
import {Toaster} from "./components/ui/sonner";
import {useContext, useEffect, useState} from "react";
import {SesionContext, SesionProvider} from "./providers/sesionProvider";
import LoginPage from "./pages/LoginPage";
import LoadingPage from "./pages/LoadingPage";
import {PageProvider} from "./providers/pageProvider";
import ModuleRoutes from "./ModuleRoutes";
import {checkToken} from "./utils/funtions";
import {toast} from "sonner";
import {SectorProcessProvider} from "./providers/sectorProcessProvider";
import {CircleCheck, CircleX, Info, Loader, TriangleAlert} from "lucide-react";

function App() {
  const PrivateRoutes = () => {
    const {setSesion} = useContext(SesionContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      checkToken({setSesion}).then((tokenValid) => {
        if (!tokenValid) {
          setLoading(false);
          setIsAuthenticated(false);
          return navigate("/login");
        }
        setIsAuthenticated(true);
        toast.success("Bienvenido(a) de nuevo");

        navigate("/home");
        setLoading(false);
      });
    }, [setSesion]);

    if (loading) return <LoadingPage />;

    return isAuthenticated ? (
      <SectorProcessProvider>
        <PageProvider>
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
              <Header />
              <div className=" @container/main flex flex-1 flex-col gap-4 p-4 animate-fadeIn md:mx-4  ">
                <main className="h-full  ">
                  <Outlet />
                </main>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </PageProvider>
      </SectorProcessProvider>
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
          <Toaster
            closeButton
            duration={2500}
            icons={{
              success: <CircleCheck className="text-green-500 bg" size={20} />, // Ícono predeterminado con color verde
              info: <Info className="text-blue-500" size={20} />, // Ícono predeterminado con color azul
              warning: <TriangleAlert className="text-yellow-500" size={20} />, // Ícono predeterminado con color amarillo
              error: <CircleX className="text-red-500" size={20} />, // Ícono predeterminado con color rojo
              loading: <Loader className="text-gray-500 animate-spin" size={20} />, // Ícono con animación
            }}
          />
        </BrowserRouter>
      </SesionProvider>
    </ThemeProvider>
  );
}

export default App;
