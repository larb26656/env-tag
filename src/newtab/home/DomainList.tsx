import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export interface DomainData {
  domain: string;
  enabled: boolean;
}

interface DomainListProps {
  dataList: DomainData[];
  onEditClick: (domain: string) => void;
  onDeleteClick: (domain: string) => void;
}

export default function DomainList({
  dataList,
  onEditClick,
  onDeleteClick,
}: DomainListProps) {
  function Action({ data }: { data: DomainData }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onEditClick(data.domain)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDeleteClick(data.domain)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20px]">No</TableHead>
          <TableHead className="w-auto">Domain</TableHead>
          <TableHead className="w-[20px]">Enable</TableHead>
          <TableHead className="w-[20px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dataList.map((data, index) => (
          <TableRow key={data.domain}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="font-medium">{data.domain}</TableCell>
            <TableCell>{data.enabled ? "True" : "False"}</TableCell>
            <TableCell>
              <Action data={data} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
