import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../table/DataTableColumnHeader";
import { DataTable } from "../table/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Button } from "../UI/Button";
import Link from "next/link";
import { Market } from "../UI/Market";

type Broker = {
  id: string;
  name: string;
  market: string;
  accounts: string[];
  assignedTeam: {
    name: string;
    id: number;
  };
};

const columnHelper = createColumnHelper<Broker>();

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
  columnHelper.accessor("accounts", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Accounts" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2">
          <div className="flex  items-center">
            <span className="max-w-[300px]">
              {props
                .getValue()
                .map((acc, index) => `${index > 0 ? " | " : ""}${acc}`)}
            </span>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const accountValues = row.getValue(id) as string[];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      return value.some((el: any) => accountValues.includes(el));
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("market", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Market" />
    ),
    cell: (props) => {
      const value = props.getValue();
      return (
        <div className="flex space-x-2">
          <Market market={value} />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      console.log(value, row.getValue(id));
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const accountValues = row.getValue(id) as string;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      return value.includes(accountValues);
    },
    enableSorting: true,
    enableHiding: false,
  }),
  columnHelper.accessor("assignedTeam", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Team" />
    ),
    cell: (props) => {
      return (
        <div className="flex space-x-2">
          <Link href={`/dashboard/teams/${props.getValue().id}`}>
            <Button variant="link">
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

const BrokersTable: React.FC<{
  data: Broker[];
  cardClass?: string;
  bankId: string;
  openSheet: () => void;
}> = ({ data, cardClass, bankId, openSheet }) => {
  const accounts = Array.from(
    new Set(data.flatMap((broker) => broker.accounts))
  ).map((value) => ({ value: value }));

  const markets = Array.from(new Set(data.map((broker) => broker.market))).map(
    (value) => ({
      value: value,
      label: (
        <div className="flex space-x-2">
          <span
            className={`fi fi-${
              value === "icsd" ? "un" : value === "uk" ? "gb" : value
            }`}
          />
          <span className="truncate font-medium">{value.toUpperCase()}</span>
        </div>
      ),
    })
  );
  return (
    <Card className={cardClass}>
      <CardHeader className="px-0">
        <CardTitle>Brokers</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <DataTable
          view={false}
          columns={columns}
          data={data}
          selecting={false}
          pageSize={5}
          link={`/dashboard/banks/${bankId}/brokers`}
          filters={[
            {
              columnName: "accounts",
              title: "Account",
              options: [...accounts],
            },
            {
              columnName: "market",
              title: "Market",
              options: [...markets],
            },
          ]}
          actions={
            <Button className="h-8" onClick={openSheet}>
              Add New
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};

export default BrokersTable;
