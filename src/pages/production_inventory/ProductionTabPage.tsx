 import SelectorTabPage from '@/components/SelectorTabPage';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import React, { useCallback, useEffect, useState } from 'react'
 import { getAllProducts } from '@/api/product/product.api';
import ProductPage from './product/ProductPage';
import { GeneralInterfaces } from '@/utils/interfaces';
import OrderPage from './production/OrderPage';
import { getAllOrders } from '@/api/production/order.api';
import { getAllProductions } from '@/api/production/production.api';
import ProductionPage from './production/ProductionPage';

const ProductionTabPage = () => {
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
}

export default ProductionTabPage


const tabData = [
  {
    id: "tab1",
    label: "Producción",
    content: ProductionPage,
    get: getAllProductions
  },
  {
    id: "tab2",
    label: "Orden",
    content: OrderPage,
    get: getAllOrders}
];
