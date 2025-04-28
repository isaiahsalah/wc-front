import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tally5, TrendingUpIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"; 
import { countCurrentMonth } from "@/utils/funtions";
import { OrderInterfaces } from "@/utils/interfaces";

interface Props {
  initialData: OrderInterfaces[];
}

const OrderCards: React.FC<Props> = ({ initialData }) => {
  return (
    <div className="grid grid-cols-6 gap-4">
      <Card className="@container/card col-span-6 lg:col-span-6">
        <CardHeader className="relative">
          <CardDescription>Órdenes registradas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {initialData.length} Órdenes
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              {/*@ts-expect-error: Ignoramos el error en esta línea */}+
              {countCurrentMonth(initialData)} este mes
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
    </div>
  );
};

export default OrderCards;
