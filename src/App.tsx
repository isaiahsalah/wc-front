import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import HomePage from "./pages/HomePage";
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
import { useContext } from "react";
import { SesionContext, SesionProvider } from "./providers/sesion-provider";
import LoginPage from "./pages/LoginPage";
import ExamplePage from "./pages/ExamplePage";
import ExpandidoPage from "./pages/ExpandidoPage";
import MaquinaPage from "./pages/MaquinaPage";

function App() {
  const PrivateRoutes = () => {
    const context = useContext(SesionContext);

    if (context === undefined) {
      return <Navigate to="/login" />;
    } else {
      return <Outlet />;
    }
  };

  return (
    <SesionProvider>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <Header />
              <div className="flex flex-1 flex-col gap-4 p-4 ">
                <main className=" h-full">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/example" element={<ExamplePage />} />

                    <Route path="/expandido" element={<ExpandidoPage />} />
                    <Route
                      path="opr/:sector/:proceso/:maquina"
                      element={<MaquinaPage />}
                    />
                    <Route path="/login" element={<LoginPage />} />

                    {/*
                    <Route element={<PrivateRoutes />}>
                      <Route path="/*" element={<HomePage />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />

                    */}
                  </Routes>
                </main>
              </div>
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </SesionProvider>
  );
}

export default App;
