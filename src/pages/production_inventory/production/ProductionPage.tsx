import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import ProductionTable from "@/components/tables/production/ProductionTable";
import ProductionCards from "@/components/cards/production/ProductionCards";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const ProductionPage: React.FC<Props> =  (({ data, updateView }) => {
  return (
    <div className="flex flex-col gap-4">
      <ProductionCards initialData={data} />
      <ProductionTable data={data} updateView={updateView} />
    </div>
  );
});

export default ProductionPage;
