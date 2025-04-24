import { useContext, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tally5, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TitleContext } from "@/providers/title-provider";
import { z } from "zod";
import { GeneralSchema } from "@/utils/interfaces";

interface Props {
  initialData: z.infer<typeof GeneralSchema>[];
}

const ColorCards: React.FC<Props> = ({ initialData }) => {
  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle("Colores");
  }, []);

  return (
    <div className="grid grid-cols-6 gap-4">
      <Card className="@container/card col-span-6 lg:col-span-2">
        <CardHeader className="relative">
          <CardDescription>Colores registrados</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {initialData.length} Colores
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +5 este mes
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total acumulado en el sistema
            <Tally5 className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Mantén actualizada esta cantidad para un registro preciso.
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card col-span-6 sm:col-span-3 lg:col-span-2">
        <CardHeader className="relative">
        <CardDescription>Color más producido</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            Blue
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +10%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
          Incremento en la producción este mes <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">      Basado en los datos de producción actuales
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card col-span-6 sm:col-span-3 lg:col-span-2">
        <CardHeader className="relative">
        <CardDescription>Color menos producido</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            Brown
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              -2%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
          Disminución este mes <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">      Basado en los datos de producción actuales
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ColorCards;
