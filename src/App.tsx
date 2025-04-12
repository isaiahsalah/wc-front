import {
  SidebarInset,
  SidebarProvider,
} from "./components/ui/sidebar";
import HomePage from "./pages/HomePage";
import { AppSidebar } from "@/components/app-sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./providers/theme-provider";

import Header from "./components/app-header";
import { Toaster } from "./components/ui/sonner";
import ExpandidoPage from "./pages/ExpandidoPage";

function App() {
  
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header/>
            <div className="flex flex-1 flex-col gap-4 p-4 ">
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/expandido" element={<ExpandidoPage />} />

                </Routes>
              </main>
              
            </div>
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
