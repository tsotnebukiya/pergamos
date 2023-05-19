import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "../UI/Badge";
import { Checkbox } from "../UI/Checkbox";
import { DataTableColumnHeader } from "../table/DataTableColumnHeader";
import { z } from "zod";
import {
  ArrowDownToLine,
  ArrowRightToLine,
  ArrowUpCircle,
  ArrowUpToLine,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
} from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { Copy, MoreHorizontal, Pen, Star, Trash } from "lucide-react";
import { Button } from "../UI/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../UI/DropDownMenu";
import { DataTable } from "../table/DataTable";
import { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: ArrowUpCircle,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownToLine,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightToLine,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpToLine,
  },
];

const statusFilter = {
  columnName: "status",
  title: "Status",
  options: statuses,
};

const priorityFilter = {
  columnName: "priority",
  title: "Priority",
  options: priorities,
};

export const brokerSchema = z.object({
  id: z.number(),
  title: z.string(),
  account: z.string(),
  assignedTeam: z.string(),
});

export type Broker = z.infer<typeof brokerSchema>;

export const columns: ColumnDef<Broker>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex  items-center">
          <span>{row.getValue("account")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      console.log(value, row.getValue(id));
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "assignedTeam",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Team" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("assignedTeam")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      console.log(row, id, value);
      return value.includes(row.getValue(id));
    },
  },
];

const BrokersTable: React.FC<{
  data: Broker[];
  cardClass?: string;
}> = ({ data, cardClass }) => {
  const accounts = [
    ...new Set(
      data.map((broker) => ({
        value: broker.account.toString(),
      }))
    ),
  ];
  console.log(accounts);
  return (
    <Card className={cardClass}>
      <CardHeader>
        <CardTitle>Brokers</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          selecting={false}
          pageSize={5}
          filters={[
            { columnName: "account", title: "Account", options: [...accounts] },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default BrokersTable;
