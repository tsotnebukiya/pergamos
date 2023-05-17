import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { classNames } from "pergamos/utils/classNames";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import type { RouterOutputs } from "pergamos/utils/api";
import Link from "next/link";
import ButtonStyle from "../UI/ButtonStyle";

const colors = [
  "bg-green-500",
  "bg-blue-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-gray-500",
  "bg-teal-500",
  "bg-orange-500",
];

type BanksList = RouterOutputs["banks"]["getAll"];

const BanksList: React.FC<{ banks: BanksList }> = ({ banks }) => {
  return (
    <div className="col-span-3">
      <div className="flex justify-between">
        <h2 className="text-sm font-medium text-gray-500">Banks List</h2>
        <Link href="/dashboard/banks/create">
          <ButtonStyle text="New"></ButtonStyle>
        </Link>
      </div>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        {banks.map((bank, index) => (
          <li key={bank.id} className="col-span-1 flex rounded-md shadow-sm">
            <div
              className={classNames(
                colors[index % colors.length] as string,
                "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
              )}
            >
              {bank.name.slice(0, 2)}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <Link
                  href={"/dashboard/banks/" + bank.id.toString()}
                  className="font-medium text-gray-900 hover:text-gray-600"
                >
                  {bank.name}
                </Link>
                <p className="text-gray-500">{bank._count.teams} Brokers</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {/* <nav className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
        <div className="-mt-px flex w-0 flex-1">
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <ArrowLongLeftIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </a>
        </div>
        <div className="hidden md:-mt-px md:flex">
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            1
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
            aria-current="page"
          >
            2
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            3
          </a>
          <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
            ...
          </span>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            8
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            9
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            10
          </a>
        </div>
        <div className="-mt-px flex w-0 flex-1 justify-end">
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <ArrowLongRightIcon
              className="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </a>
        </div>
      </nav> */}
    </div>
  );
};

export default BanksList;
