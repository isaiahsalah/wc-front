 import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import ModelCards from "@/components/cards/ModelCards";
import ModelTable from "@/components/tables/ModelTable";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const ModelPage: React.FC<Props> =  (({ data, updateView }) => {
  return (
    <div className="flex flex-col gap-4">
      <ModelCards initialData={data} />
      <ModelTable data={data} updateView={updateView} />
    </div>
  );
});

export default ModelPage;
