import { useEffect, useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import ColorHeader from "./product/color/ColorHeader";
import ColorActions from "./product/color/ColorActions";
import { getColors } from "@/api/color.api";
import { GeneralInterfaces } from "@/utils/interfaces";
import { ColorTableColumns } from "./product/color/ColorTableColums";
import DataTableDinamic from "@/components/DataTableDinamic";
import SelectorTabPage from "@/components/SelectorTabPage";
import RegisterProductionPage from "@/trash/operator/production/RegisterProductionPage";

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]?.id || "");
  const [data, setData] = useState<GeneralInterfaces[] | never[]>([]);
  const [loading, setLoading] = useState(false); // Estado de carga

  useEffect(() => {
    console.log("Data:", data);
  }, [data]);

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

  const updateView = async () => {
    setLoading(true); // Inicia la carga
    try {
      if (activeTab === "color") setData(await getColors());
      else setData([]);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

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
            <tab.header initialData={data} />
          )}
        </TabsContent>
      ))}

      {tabData.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {loading ? ( // Muestra un indicador de carga mientras se obtienen los datos
            <div>Cargando datos...</div>
          ) : (
            <DataTableDinamic
              data={data}
              columns={tab.columns({ updateView })}
            />
          )}
        </TabsContent>
      ))}
      {/* <DataTable data={dataExample} />*/}
    </Tabs>
  );
};

export default ProductPage;

const tabData = [
  {
    id: "tab1",
    label: "Producto",
    header: ColorHeader,
    actions: ColorActions,
    columns: ColorTableColumns,
  },
  {
    id: "tab2",
    label: "Modelo",
    header: ColorHeader,
    actions: ColorActions,
    columns: ColorTableColumns,
  },
  {
    id: "tab3",
    label: "Unidad de Medida",
    header: ColorHeader,
    actions: ColorActions,
    columns: ColorTableColumns,
  },
  {
    id: "color",
    label: "Color",
    header: ColorHeader,
    actions: ColorActions,
    columns: ColorTableColumns,
  },
  {
    id: "tab5",
    label: "Fórmula",
    header: ColorHeader,
    actions: ColorActions,
    columns: ColorTableColumns,
  },
];
