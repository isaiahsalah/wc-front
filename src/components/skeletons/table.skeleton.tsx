import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { randomNumber } from "@/lib/utils";

interface Props {
  rows: number;
  colums: number;
}

const SkeletonTable: React.FC<Props> = ({ rows, colums }) => {


  return (
    <Table>
      <TableCaption>
        <Skeleton 
        className="h-5 " 
        style={{ width: `${randomNumber(70, 100)}%` }} 
        />
      </TableCaption>

      <TableHeader>
        <TableRow>
          {Array.from({ length: colums }).map((_, i) => (
            <TableHead key={i}>
              <Skeleton
                className="h-5   "
                style={{ width: `${randomNumber(40, 100)}%` }}
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: colums }).map((_, i) => (
              <TableCell key={i}>
                <Skeleton
                  className={`h-5 `}
                  style={{ width: `${randomNumber(80, 100)}%` }}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SkeletonTable;
