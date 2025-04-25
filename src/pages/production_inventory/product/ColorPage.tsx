 import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";
import ColorCards from "@/components/cards/product/ColorCards";
import ColorTable from "@/components/tables/product/ColorTable";
import { useContext, useEffect } from "react";
import { TitleContext } from "@/providers/title-provider";

interface Props {
  data: z.infer<typeof GeneralSchema>[];
  updateView: () => void;
}

const ColorPage: React.FC<Props> =  (({ data, updateView }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Colores");
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <ColorCards initialData={data} />
      <ColorTable data={data} updateView={updateView} />
    </div>
  );
});

export default ColorPage;
