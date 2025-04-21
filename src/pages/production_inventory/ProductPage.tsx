import  { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductHeader from "./product/product/ProductHeader";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductActions from "./product/product/ProductActions";
import { Separator } from "@/components/ui/separator";
import ProductTable from "./product/product/ProductTable";
import ColorHeader from "./product/color/ColorHeader";
import ColorActions from "./product/color/ColorActions";
import ColorTable from "./product/color/ColorTable";
import { getColors } from "@/api/color.api";

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState(tabData[0]?.id || "");

  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const data = await getColors();
        console.log("Colores:", data);
        setColors(data);
      } catch (error) {
        console.error("Error al cargar los colores:", error);
      }
    };

    fetchColors();
  }, []);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value)}
      className="flex w-full flex-col justify-start gap-4"
    >
      {tabData.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.header}
        </TabsContent>
      ))}
      <Separator />
      <div className="flex items-center justify-between ">
        <Select
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <SelectTrigger className="xl:hidden flex w-fit" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            {tabData.map((tab) => (
              <SelectItem key={tab.id} value={tab.id}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <TabsList className="xl:flex hidden">
          {tabData.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabData.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.actions}
          </TabsContent>
        ))}
      </div>

      {tabData.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
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
    header: <ProductHeader />,
    actions: <ProductActions />,
    content: <ProductTable />,
  },
  {
    id: "tab2",
    label: "Modelo",
    header: <ProductHeader />,
    actions: <ProductActions />,
    content: <ProductTable />,
  },
  {
    id: "tab3",
    label: "Unidad de Medida",
    header: <ProductHeader />,
    actions: <ProductActions />,
    content: <ProductTable />,
  },
  {
    id: "tab4",
    label: "Color",
    header: <ColorHeader />,
    actions: <ColorActions />,
    content: <ColorTable />,
  },
  {
    id: "tab5",
    label: "Fórmula",
    header: <ProductHeader />,
    actions: <ProductActions />,
    content: <ProductTable />,
  },
];
