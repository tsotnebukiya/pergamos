import { BanknotesIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { HeroIcon } from "pergamos/utils/types";

type StatCardProps = {
  Icon: HeroIcon;
  name: string;
  href: string;
  stats: string;
};

const StatCard: React.FC<StatCardProps> = ({ Icon, href, name, stats }) => {
  return (
    <div
      className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow
   dark:bg-gray-900 dark:shadow-none dark:ring-1 dark:ring-white/10 sm:px-6 sm:pt-6 "
    >
      <dt>
        <div className="absolute rounded-md bg-indigo-500 p-3">
          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-300">
          {name}
        </p>
      </dt>
      <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
          {stats}
        </p>
        <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 dark:bg-black/10 sm:px-6">
          <div className="text-sm">
            <Link
              href={href}
              className="font-medium text-indigo-600  hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              View all
            </Link>
          </div>
        </div>
      </dd>
    </div>
  );
};

const BankStats: React.FC<{
  bankId: string;
  transactions?: number;
  volume?: number;
}> = ({ transactions, volume, bankId }) => {
  // bankId to construct href to redirect to /dashboard/banks/3/transactions
  return (
    <div className="lg:col-start-3 lg:row-end-1">
      <dl className="grid grid-cols-1 gap-5 ">
        {transactions && transactions > 0 && (
          <StatCard
            Icon={PaperAirplaneIcon}
            href={`/dashboard/banks/${bankId}/payments`}
            name="Transactions"
            stats={transactions.toString()}
          />
        )}
        {volume && volume > 0 && (
          <StatCard
            Icon={BanknotesIcon}
            href={`/dashboard/banks/${bankId}/payments`}
            name="Volume"
            stats={volume.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            })}
          />
        )}
      </dl>
    </div>
  );
};

export default BankStats;
