import { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import SelectorTabPage from "@/components/SelectorTabPage";
import ColorPage from "./product/ColorPage";
import UnityPage from "./product/UnityPage";
import FormulaPage from "./product/FormulaPage";
import ProductPage from "./product/ProductPage";
import { TitleContext } from "@/providers/title-provider";

const ProductTabPage = () => {
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

export default ProductTabPage;

const tabData = [
  {
    id: "tab1",
    label: "Producto",
    title: "Gestionar Productos",
    content: ProductPage,
  },
  {
    id: "tab2",
    label: "Unidad de Medida",
    title: "Gestionar Medidas",
    content: UnityPage,
  },
  {
    id: "tab3",
    label: "Color",
    title: "Gestionar Colores",
    content: ColorPage,
  },
  {
    id: "tab4",
    label: "Fórmula",
    title: "Gestionar Fórmulas",
    content: FormulaPage,
  },
];
