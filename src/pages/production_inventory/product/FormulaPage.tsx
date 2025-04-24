 import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
 import FormulaTable from "@/components/tables/FormulaTable";
import FormulaCards from "@/components/cards/FormulaCards";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const FormulaPage: React.FC<Props> =  (({ data, updateView }) => {
  return (
    <div className="flex flex-col gap-4">
      <FormulaCards initialData={data} />
      <FormulaTable data={data} updateView={updateView} />
    </div>
  );
});

export default FormulaPage;
