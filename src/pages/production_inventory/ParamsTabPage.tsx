import { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import SelectorTabPage from "@/components/SelectorTabPage";
import ModelPage from "./params/ModelPage";
import MachinePage from "./params/MachinePage";
import ProcessPage from "./params/ProcessPage";
import SectorPage from "./params/SectorPage";
import { TitleContext } from "@/providers/title-provider";

const ParamsTabPage = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]);

  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle(activeTab.title);
  }, [activeTab, setTitle]);

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
          <tab.content />
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
    title: "Gestionar Modelo",
    content: ModelPage,
  },
  {
    id: "tab2",
    label: "Maquina",
    title: "Gestionar Maquina",
    content: MachinePage,
  },
  {
    id: "tab3",
    label: "Proceso",
    title: "Gestionar Proceso",
    content: ProcessPage,
  },
  {
    id: "tab4",
    label: "Sector",
    title: "Gestionar Sector",
    content: SectorPage,
  },
];
