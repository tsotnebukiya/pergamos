import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../table/DataTableColumnHeader";
import { DataTable } from "../table/DataTable";
import { Button } from "../UI/Button";
import { type RouterOutputs } from "pergamos/utils/api";

type Bank = RouterOutputs["banks"]["getAll"][number];

const columnHelper = createColumnHelper<Bank>();

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
  columnHelper.accessor("website", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Website" />
    ),
    cell: (props) => {
      console.log(props.getValue());
      return (
        <div className="flex space-x-2 font-medium ">
          <span className="max-w-[150px]">
            <a
              href={props.getValue()}
              className="hover:underline"
              target="_blank"
            >
              {props.getValue()}
            </a>
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  }),
  columnHelper.accessor("_count.teams", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brokers" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2 ">
          <span className=" max-w-[300px] truncate font-medium">
            {props.getValue()}
          </span>
        </div>
      );
    },

    enableSorting: true,
    enableHiding: false,
  }),
];

const BanksTable: React.FC<{
  data: Bank[];
  openSheet: () => void;
}> = ({ data, openSheet }) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      selecting={false}
      link={`/dashboard/banks`}
      actions={
        <Button className="h-8" onClick={openSheet}>
          Add New
        </Button>
      }
    />
  );
};

export default BanksTable;
