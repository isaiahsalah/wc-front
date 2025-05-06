import {useContext, useEffect, useState} from "react";
import {Tabs, TabsContent} from "@/components/ui/tabs";
import {Separator} from "@/components/ui/separator";
import SelectorTabPage from "@/components/SelectorTabPage";
import ProductPage from "./product/ProductPage";
import {TitleContext} from "@/providers/title-provider";

const InventoryTabPage = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]);

  const {setTitle} = useContext(TitleContext);

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
      className="flex w-full flex-col justify-start gap-2"
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

export default InventoryTabPage;

const tabData = [
  {
    id: "tab1",
    title: "Inventario",
    label: "Producto",
    content: ProductPage,
  },
];
