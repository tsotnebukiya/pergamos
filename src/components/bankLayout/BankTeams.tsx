import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Button from "../UI/ButtonStyle";
import EmptyState from "../UI/EmptyState";
import CardHeader from "../UI/CardHeader";

type TableRowProps = {
  teamId: string;
  name: string;
  assignedTeam: string;
  accounts: { account: string; market: string }[];
};

const TableRow: React.FC<TableRowProps & { bankId: string }> = ({
  accounts,
  assignedTeam,
  teamId,
  name,
  bankId,
}) => {
  return (
    <li
      key={teamId}
      className="relative py-6 hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <Link href={`/dashboard/banks/${bankId}/brokers/${teamId}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl justify-between gap-x-6">
            <div className="flex gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="font-semibold leading-6 text-gray-900 dark:text-white">
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {name}
                </p>
                <ul className="mt-1 flex text-xs leading-5 text-gray-500 dark:text-gray-400">
                  {accounts.map((acc, index) => (
                    <li key={acc.account}>
                      {acc.account + " · " + acc.market}
                      {index < accounts.length - 1 && (
                        <span className="mx-3 text-gray-400 dark:text-gray-500">
                          |
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="dark:text text-sm font-medium leading-6 text-gray-900 dark:text-gray-400">
                  {assignedTeam}
                </p>
              </div>
              <ChevronRightIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

const BankTeams: React.FC<{ teams: TableRowProps[]; bankId: string }> = ({
  teams,
  bankId,
}) => {
  return (
    <>
      <div className=" overflow-hidden rounded-xl border border-gray-200  shadow-lg dark:border-white/10 lg:col-span-2 lg:row-span-2 lg:row-end-2">
        {teams.length > 0 ? (
          <>
            <CardHeader heading="Broker teams">
              <Link href={`/dashboard/banks/${bankId}/brokers/create`}>
                <Button text="Add new team" />
              </Link>
            </CardHeader>
            <ul
              role="list"
              className="max-h-[510px] divide-y divide-gray-100 overflow-auto dark:divide-white/10 "
            >
              {teams.map((team) => (
                <TableRow
                  key={team.teamId}
                  accounts={team.accounts}
                  assignedTeam={team.assignedTeam}
                  teamId={team.teamId}
                  name={team.name}
                  bankId={bankId}
                />
              ))}
            </ul>
          </>
        ) : (
          <EmptyState
            heading="No brokers"
            text="Get started by creating a new broker"
            linktext="New Broker"
            link="/dashboard/banks/brokers/create"
          />
        )}
      </div>
    </>
  );
};

export default BankTeams;
