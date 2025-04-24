 import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import ProductCards from "@/components/cards/ProductCards";
import ProductTable from "@/components/tables/ProductTable";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const ProductPage: React.FC<Props> =  (({ data, updateView }) => {
  return (
    <div className="flex flex-col gap-4">
      <ProductCards initialData={data} />
      <ProductTable data={data} updateView={updateView} />
    </div>
  );
});

export default ProductPage;
