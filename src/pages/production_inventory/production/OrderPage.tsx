import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import OrderCards from "@/components/cards/production/OrderCards";
import OrderTable from "@/components/tables/production/OrderTable";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const OrderPage: React.FC<Props> =  (({ data, updateView }) => {
  return (
    <div className="flex flex-col gap-4">
      <OrderCards initialData={data} />
      <OrderTable data={data} updateView={updateView} />
    </div>
  );
});

export default OrderPage;
