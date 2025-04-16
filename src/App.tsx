import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "@/components/side-bar/app-sidebar";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";

import Header from "./components/app-header";
import { Toaster } from "./components/ui/sonner";
import { useContext, useEffect, useState } from "react";
import { SesionContext, SesionProvider } from "./providers/sesion-provider";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { getCheckToken } from "./api/login.api";
import { SesionInterface } from "./utils/interfaces";

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
      //tiempo para que el loading se vea
      setTimeout(() => {
        checkToken();
      }, 1050);
    }, [setSesion]);

    if (loading)
      return (
        <div className="flex w-full h-screen items-center justify-center animate-fadeOutInfinite">
          <div className="w-24 h-24 bg-blue-500 absolute animate-dropDown"></div>
        </div>
      );

    return isAuthenticated ? (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="flex flex-1 flex-col gap-4 p-4 animate-fadeIn ">
            <main className="h-full ">
              <Outlet />
            </main>
          </div>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SesionProvider>
        <BrowserRouter>
          <main className=" flex h-[100vh] animate-fadeIn ">
            <Routes>
              <Route element={<PrivateRoutes />}>
                <Route path="/*" element={<HomePage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
          <Toaster />
        </BrowserRouter>
      </SesionProvider>
    </ThemeProvider>
  );
}

export default App;
