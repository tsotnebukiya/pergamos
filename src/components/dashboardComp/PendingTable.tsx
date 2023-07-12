import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../table/DataTableColumnHeader";
import { DataTable } from "../table/DataTable";
import { Button } from "../UI/Button";
import { type RouterOutputs } from "pergamos/utils/api";
import Link from "next/link";
import { NumericFormat } from "react-number-format";
import {
  StopwatchIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { CSVLink, CSVDownload } from "react-csv";
import { Badge } from "../UI/Badge";

type Icon = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>;

// type Payment = RouterOutputs["payments"]["getAll"][number];
type Payment = RouterOutputs["payments"]["dashboard"]["payments"][number];

const columnHelper = createColumnHelper<Payment>();

const handleCellClick = (event: React.MouseEvent) => {
  event.stopPropagation();
};

const volumes = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];

const Volume: React.FC<{ value: "low" | "medium" | "high" }> = ({ value }) => {
  if (value === "low")
    return (
      <div className="flex gap-2">
        <ArrowDownIcon />
        {`${volumes[0]?.label || ""}`}
      </div>
    );
  if (value === "medium")
    return (
      <div className="flex gap-2">
        <ArrowRightIcon />
        {`${volumes[1]?.label || ""}`}
      </div>
    );
  if (value === "high")
    return (
      <div className="flex gap-2">
        <ArrowUpIcon />
        {`${volumes[2]?.label || ""}`}
      </div>
    );
  return <div></div>;
};

const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: StopwatchIcon,
  },
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircledIcon,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: CrossCircledIcon,
  },
];

const columns = [
  columnHelper.accessor("id", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[300px] truncate">PM-{props.getValue()}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("amount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: (props) => {
      return (
        <span className="max-w-[300px]">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: `${props.row.original.ssi.currency.toUpperCase()}`,
          }).format(props.getValue())}
        </span>
      );
    },
  }),
  columnHelper.accessor("valueDate", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value Date" />
    ),
    cell: (props) => {
      return (
        <span className="max-w-[300px]">{props.getValue().toDateString()}</span>
      );
    },
  }),
  columnHelper.accessor("purpose", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: (props) => {
      return (
        <span className="max-w-[300px] truncate">
          <Badge variant="secondary">{props.getValue().toUpperCase()}</Badge>
        </span>
      );
    },
  }),
  columnHelper.accessor("broker", {
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
            onClick={handleCellClick}
          >
            <Button variant="link">
              <span className="max-w-[300px] truncate">
                {props.getValue().name}
              </span>
            </Button>
          </Link>
        </div>
      );
    },
  }),
];

const PendingTable: React.FC<{
  data: Payment[];
}> = ({ data }) => {
  return (
    <>
      <DataTable
        view={false}
        columns={columns}
        data={data}
        selecting={false}
        link={`/dashboard/payments`}
        id={true}
        pageSize={5}
        hideToolbar={true}
      />
    </>
  );
};

export default PendingTable;
