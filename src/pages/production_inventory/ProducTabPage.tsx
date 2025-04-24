import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getAllColors } from "@/api/color.api";
import { GeneralInterfaces } from "@/utils/interfaces";
import SelectorTabPage from "@/components/SelectorTabPage";
import ColorPage from "./product/ColorPage";
import ModelPage from "./product/ModelPage";
import UnityPage from "./product/UnityPage";
import FormulaPage from "./product/FormulaPage";
import ProductPage from "./product/ProductPage";

const ProductTabPage = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]?.id || "");
  const [data, setData] = useState<GeneralInterfaces[] | never[]>([]);
  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    updateView();
  }, [activeTab]);

  /*
  const fetchColors = async () => {
    setLoading(true); // Inicia la carga
    try {
      const colorData = await getColors();
      console.log("Colores:", colorData);
      await setData(colorData);
    } catch (error) {
      console.error("Error al cargar los colores:", error);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };*/

  const updateView = useCallback(async () => {
    setLoading(true);
    //console.log("se actualizaron los datos");
    try {
      if (activeTab === "color") setData(await getAllColors());
      else setData([]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      className="flex w-full flex-col justify-start gap-4"
    >
      <SelectorTabPage
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
  },
  {
    id: "tab2",
    label: "Modelo",
    content: ModelPage,
  },
  {
    id: "tab3",
    label: "Unidad de Medida",
    content: UnityPage,
  },
  {
    id: "color",
    label: "Color",
    content: ColorPage,
  },
  {
    id: "tab5",
    label: "Fórmula",
    content: FormulaPage,
  },
];
