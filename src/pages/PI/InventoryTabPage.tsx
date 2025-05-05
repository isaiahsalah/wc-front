import {useCallback, useEffect, useState} from "react";
import {Tabs, TabsContent} from "@/components/ui/tabs";
import {Separator} from "@/components/ui/separator";
import {IGeneral} from "@/utils/interfaces";
import SelectorTabPage from "@/components/SelectorTabPage";
import ProductPage from "./product/ProductPage";
import {getProducts} from "@/api/product/product.api";

const InventoryTabPage = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]);
  const [data, setData] = useState<IGeneral[]>([]);
  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    updateView();
  }, [activeTab]);

  const updateView = useCallback(async () => {
    setLoading(true);
    //console.log("se actualizaron los datos");
    try {
      setData(await activeTab.get({}));
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

export default InventoryTabPage;

const tabData = [
  {
    id: "tab1",
    label: "Producto",
    content: ProductPage,
    get: getProducts,
  },
];
