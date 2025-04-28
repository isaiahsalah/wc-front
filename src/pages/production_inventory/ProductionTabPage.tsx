import SelectorTabPage from "@/components/SelectorTabPage";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useContext, useEffect, useState } from "react";
import OrderPage from "./production/OrderPage";
import ProductionPage from "./production/ProductionPage";
import { TitleContext } from "@/providers/title-provider"; 
const ProductionTabPage = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]);

  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    
    setTitle(activeTab.label); 
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
          <tab.content />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProductionTabPage;

const tabData = [
  {
    id: "tab1",
    title: "Gestionar Producción",
    label: "Producción",
    content: ProductionPage,
  },
  {
    id: "tab2",
    title: "Gestionar Orden",
    label: "Orden",
    content: OrderPage,
  },
];
