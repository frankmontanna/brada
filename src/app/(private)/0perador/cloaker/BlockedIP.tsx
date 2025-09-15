import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BlockedIP {
  ip?: string;
  createdAt?: string;
}

export function BlockedIP({ ip, createdAt }: BlockedIP) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">IP</TableHead>
            <TableHead className="">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{ip}</TableCell>
            <TableCell>{createdAt}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
