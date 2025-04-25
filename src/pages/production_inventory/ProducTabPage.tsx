import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getAllColors } from "@/api/product/color.api";
import { GeneralInterfaces } from "@/utils/interfaces";
import SelectorTabPage from "@/components/SelectorTabPage";
import ColorPage from "./product/ColorPage";
import ModelPage from "./product/ModelPage";
import UnityPage from "./product/UnityPage";
import FormulaPage from "./product/FormulaPage";
import ProductPage from "./product/ProductPage";
import { getAllProducts } from "@/api/product/product.api";
import { getAllModels } from "@/api/product/model.api";
import { getAllUnities } from "@/api/product/unity.api";
import { getAllFormulas } from "@/api/product/formula.api";
import DataTable from "@/components/table/DataTable";
  
const ProductTabPage = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]);
  const [data, setData] = useState<GeneralInterfaces[] | never[]>([]);
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
      value={activeTab.id }
      onValueChange={(value) => {
        const selectedTab = tabData.find((tab) => tab.id === value);
        if (selectedTab) setActiveTab(selectedTab);
      }}
      className="flex w-full flex-col justify-start gap-4"
    >
      <SelectorTabPage
        activeTab={activeTab.id }
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
            <tab.content data={data} updateView={updateView} />
          )}
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
    content: ProductPage,
    get: getAllProducts
  },
  {
    id: "tab2",
    label: "Modelo",
    content: ModelPage,
    get: getAllModels
  },
  {
    id: "tab3",
    label: "Unidad de Medida",
    content: UnityPage,
    get: getAllUnities
  },
  {
    id: "color",
    label: "Color",
    content: ColorPage,
    get: getAllColors
  },
  {
    id: "tab5",
    label: "Fórmula",
    content: FormulaPage,
    get: getAllFormulas
  },
];
