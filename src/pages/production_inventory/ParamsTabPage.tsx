import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator"; 
import { GeneralInterfaces } from "@/utils/interfaces";
import SelectorTabPage from "@/components/SelectorTabPage"; 
import ModelPage from "./params/ModelPage"; 
import { getAllModels } from "@/api/params/model.api"; 
import MachinePage from "./params/MachinePage";
import { getAllMachines } from "@/api/params/machine.api";
import ProcessPage from "./params/ProcessPage";
import { getAllProcesses } from "@/api/params/process.api";
import SectorPage from "./params/SectorPage";
import { getAllSectors } from "@/api/params/sector.api";

const ParamsTabPage = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]);
  const [data, setData] = useState<GeneralInterfaces[]>([]);
  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    updateView();
  }, [activeTab]);

  const updateView = useCallback(async () => {
    setLoading(true);
    //console.log("se actualizaron los datos");
    try {
      setData(await activeTab.get());
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  return (
    <Tabs
      value={activeTab.id}
      onValueChange={(value) => {
        const selectedTab = tabData.find((tab) => tab.id === value);
        if (selectedTab) setActiveTab(selectedTab);
      }}
      className="flex w-full flex-col justify-start gap-4"
    >
      <SelectorTabPage
        activeTab={activeTab.id}
        setActiveTab={(value) => {
          const selectedTab = tabData.find((tab) => tab.id === value);
          if (selectedTab) setActiveTab(selectedTab);
        }}
        tabData={tabData}
      />
      <Separator />
      {tabData.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {loading ? ( // Muestra un indicador de carga mientras se obtienen los datos
            <div>Cargando datos...</div>
          ) : (
            // @ts-expect-error: Ignoramos el error en esta línea
            <tab.content data={data} updateView={updateView} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ParamsTabPage;

const tabData = [
  {
    id: "tab1",
    label: "Modelo",
    content: ModelPage,
    get: getAllModels,
  },
  {
    id: "tab2",
    label: "Maquina",
    content: MachinePage,
    get: getAllMachines,
  },
  {
    id: "tab3",
    label: "Proceso",
    content: ProcessPage,
    get: getAllProcesses,
  },
  {
    id: "tab4",
    label: "Sector",
    content: SectorPage,
    get: getAllSectors,
  },
];
