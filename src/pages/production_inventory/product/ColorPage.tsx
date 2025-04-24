 import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import ColorCards from "@/components/cards/ColorCards";
import ColorTable from "@/components/tables/ColorTable";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const ColorPage: React.FC<Props> =  (({ data, updateView }) => {
  return (
    <div className="flex flex-col gap-4">
      <ColorCards initialData={data} />
      <ColorTable data={data} updateView={updateView} />
    </div>
  );
});

export default ColorPage;
