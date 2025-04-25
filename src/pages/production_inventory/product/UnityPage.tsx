 import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import UnityCards from "@/components/cards/product/UnityCards";
import UnityTable from "@/components/tables/product/UnityTable";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const UnityPage: React.FC<Props> =  (({ data, updateView }) => {
  return (
    <div className="flex flex-col gap-4">
      <UnityCards initialData={data} />
      <UnityTable data={data} updateView={updateView} />
    </div>
  );
});

export default UnityPage;
