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
import {ProcessProvider} from "./providers/processProvider";

function App() {
  const PrivateRoutes = () => {
    const {setSesion} = useContext(SesionContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      checkToken({setSesion}).then((tokenValid) => {
        //console.log("🤑🤑", tokenValid);

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
    /*
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
*/
    if (loading) return <LoadingPage />;

    return isAuthenticated ? (
      <ProcessProvider>
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
      </ProcessProvider>
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
          <Toaster closeButton duration={2500} />
        </BrowserRouter>
      </SesionProvider>
    </ThemeProvider>
  );
}

export default App;
