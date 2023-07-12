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

type Payment = RouterOutputs["payments"]["getAll"][number];

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
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const currencyValue = row.getValue(id);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      console.log(currencyValue, value);
      return Number(value) === currencyValue;
    },
    enableSorting: true,
    enableHiding: false,
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

    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("ssi", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2">
          <div className="flex  items-center">
            <span className="max-w-[300px]">
              {props.getValue().currency.toUpperCase()}
            </span>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const currencyColumn = row.getValue(id) as { currency: string };
      const currency = currencyColumn.currency;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      return value.includes(currency);
    },
    enableSorting: false,
    enableHiding: false,
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
    enableSorting: false,
    enableHiding: false,
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
    enableSorting: true,
    enableHiding: false,
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: (props) => {
      const status = props.getValue();
      let Icon: Icon;
      let statusText: string;
      let color: string;
      if (status === "APPROVED") {
        Icon = CheckCircledIcon;
        statusText = "Approved";
        color = "text-green-500";
      } else if (status === "REJECTED") {
        Icon = CrossCircledIcon;
        statusText = "Rejected";
        color = "text-red-500";
      } else {
        Icon = StopwatchIcon;
        statusText = "Pending";
        color = "";
      }
      return (
        <div className={`flex max-w-[300px] gap-2 truncate ${color}`}>
          <Icon />
          <span>{statusText}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      let status = row.getValue(id) as string;
      if (status === "APPROVED") {
        status = "Approved";
      } else if (status === "REJECTED") {
        status = "Rejected";
      } else {
        status = "Pending";
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      return value.includes(status.toLowerCase());
    },
    enableSorting: true,
    enableHiding: false,
  }),
  columnHelper.accessor("amountUSD", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Volume" />
    ),
    cell: (props) => {
      const usdAm = props.getValue() as number;
      let vol: "high" | "medium" | "low";
      if (usdAm < 1000000) {
        vol = "low";
      } else if (usdAm >= 1000000 && usdAm < 10000000) {
        vol = "medium";
      } else {
        vol = "high";
      }
      return (
        <span className="max-w-[300px] truncate">
          <Volume value={vol} />
        </span>
      );
    },
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const number = row.getValue(id) as number;
      let vol: "high" | "medium" | "low";
      if (number < 1000000) {
        vol = "low";
      } else if (number >= 1000000 && number < 10000000) {
        vol = "medium";
      } else {
        vol = "high";
      }
      console.log(status, value);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      return value.includes(vol);
    },
    enableSorting: true,
    enableHiding: false,
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
          <Link
            href={`/dashboard/teams/${props.getValue().id}`}
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
    enableSorting: true,
    enableHiding: false,
  }),
];

const PaymentsTable: React.FC<{
  data: Payment[];
}> = ({ data }) => {
  const accounts = Array.from(
    new Set(data.flatMap((payment) => payment.ssi.currency))
  ).map((value) => ({ value: value, label: value.toUpperCase() }));
  const exportData = data.map((el) => {
    return {
      id: el.id,
      maker: el.maker,
      checkerI: el.checkerI,
      checkerII: el.checkerII,
      type: el.purpose,
      amountInCCY: el.amount,
      currency: el.ssi.currency,
      amountInUSD: el.amountUSD,
      status: el.status,
      broker: el.broker.name,
      citiTeam: el.citiTeam.name,
      valueDate: el.valueDate,
    };
  });
  return (
    <>
      <DataTable
        view={false}
        columns={columns}
        data={data}
        selecting={false}
        link={`/dashboard/payments`}
        id={true}
        filters={[
          {
            columnName: "ssi",
            title: "Currency",
            options: [...accounts],
          },
          {
            columnName: "status",
            title: "Status",
            options: [...statuses],
          },
          {
            columnName: "amountUSD",
            title: "Volume",
            options: [...volumes],
          },
        ]}
        actions={
          <div className="flex gap-2">
            <Button className="h-8" variant="outline">
              <CSVLink data={exportData}>Export to CSV</CSVLink>
            </Button>

            <Link href="/dashboard/payments/newpayment">
              <Button className="h-8">Add New</Button>
            </Link>
          </div>
        }
      />
    </>
  );
};

export default PaymentsTable;
