import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";
import {randomNumber} from "@/utils/funtions";
import {useEffect} from "react";

interface Props {
  rows: number;
  colums: number;
  hasOptions: boolean;
  hasPaginated: boolean;
}

const TableSkeleton: React.FC<Props> = ({rows, colums, hasOptions, hasPaginated}) => {
  useEffect(() => {
    console.log("render");
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Barra superior con filtros y opciones */}
      {!hasOptions ? null : (
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8    " style={{width: `${randomNumber(20, 100)}%`}} />
          <Skeleton className="h-8    " style={{width: `${randomNumber(20, 50)}%`}} />
        </div>
      )}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {Array.from({length: colums}).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton
                    className="h-3 my-2  bg-muted-foreground"
                    style={{width: `${randomNumber(20, 100)}%`}}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({length: rows}).map((_, i) => (
              <TableRow key={i}>
                {Array.from({length: colums}).map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton
                      className={`h-3 my-2 `}
                      style={{width: `${randomNumber(20, 100)}%`}}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Controles de paginación */}
      {!hasPaginated ? null : (
        <div className="flex items-center justify-between px-4 gap-4">
          <Skeleton className={`h-8 `} style={{width: `${randomNumber(20, 100)}%`}} />
          <Skeleton className={`h-8 `} style={{width: `${randomNumber(20, 100)}%`}} />
        </div>
      )}
    </div>
  );
};

export default TableSkeleton;
