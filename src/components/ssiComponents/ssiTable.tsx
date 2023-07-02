import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../table/DataTableColumnHeader";
import { DataTable } from "../table/DataTable";
import { Button } from "../UI/Button";
import { type RouterOutputs } from "pergamos/utils/api";
import Link from "next/link";

type SSI = RouterOutputs["ssi"]["getAll"][number];

const columnHelper = createColumnHelper<SSI>();

const handleCellClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.stopPropagation();
};
const columns = [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate font-medium">
            {props.getValue()}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  }),
  columnHelper.accessor("field57Account", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2">
          <div className="flex  items-center">
            <span className="max-w-[300px] font-medium">
              {props.getValue()}
            </span>
          </div>
        </div>
      );
    },

    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("currency", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2">
          <div className="flex  items-center">
            <span className="max-w-[300px] font-medium">
              {props.getValue().toUpperCase()}
            </span>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const currencyValues = row.getValue(id) as string;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      return value.includes(currencyValues);
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("field57Institution", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="BIC" />
    ),
    cell: (props) => {
      return (
        <span className="max-w-[300px] truncate font-medium">
          {props.getValue()}
        </span>
      );
    },
    enableSorting: true,
    enableHiding: false,
  }),
  columnHelper.accessor("brokerId", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Broker" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/banks/${props.getValue().bank}/brokers/${
              props.getValue().id
            }`}
          >
            <Button variant="link" onClick={handleCellClick}>
              <span className="max-w-[300px] truncate font-medium">
                {props.getValue().name}
              </span>
            </Button>
          </Link>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  }),
  columnHelper.accessor("citiTeam", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Team" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2">
          <Link href={`/dashboard/teams/${props.getValue().id}`}>
            <Button variant="link" onClick={handleCellClick}>
              <span className="max-w-[300px] truncate font-medium">
                {props.getValue().name}
              </span>
            </Button>
          </Link>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  }),
];

const SSITable: React.FC<{
  data: SSI[];
}> = ({ data }) => {
  const accounts = Array.from(new Set(data.flatMap((ssi) => ssi.currency))).map(
    (value) => ({ value: value, label: value.toUpperCase() })
  );
  return (
    <DataTable
      view={false}
      columns={columns}
      data={data}
      selecting={false}
      link={`/dashboard/ssi`}
      filters={[
        {
          columnName: "currency",
          title: "Currency",
          options: [...accounts],
        },
      ]}
      actions={
        <Link href="/dashboard/ssi/newssi">
          <Button className="h-8">Add New</Button>
        </Link>
      }
    />
  );
};

export default SSITable;
