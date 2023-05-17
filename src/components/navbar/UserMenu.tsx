import { Fragment } from "react";
import { Transition, Menu } from "@headlessui/react";
import { classNames } from "pergamos/utils/classNames";
import { signOut } from "next-auth/react";
import type { User } from "next-auth";
import Image from "next/image";
import {
  ChevronDownIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/20/solid";

const UserMenu: React.FC<{ user: User }> = ({ user }) => {
  const logoutHandler = () => {
    void signOut();
  };
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="-m-1.5 flex items-center p-1.5">
        <span className="sr-only">Open user menu</span>
        <Image
          alt="User Picture"
          src={
            user.image ||
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          }
          width={32}
          height={32}
          className="rounded-full bg-gray-50 dark:bg-gray-700"
        />

        <span className="hidden lg:flex lg:items-center">
          <span
            className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            aria-hidden="true"
          >
            {user.name}
          </span>
          <ChevronDownIcon
            className="ml-2 h-5 w-5 text-gray-400 dark:text-gray-200"
            aria-hidden="true"
          />
        </span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-gray-700 dark:bg-gray-800">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-200"
                      : "text-gray-700 dark:text-gray-300",
                    "group flex w-full items-center px-4 py-2 text-sm"
                  )}
                >
                  <UserPlusIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-200"
                    aria-hidden="true"
                  />
                  DummyButton
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logoutHandler}
                  className={classNames(
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-200"
                      : "text-gray-700 dark:text-gray-300",
                    "group flex w-full items-center px-4 py-2 text-sm"
                  )}
                >
                  <ArrowLeftOnRectangleIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-gray-200"
                    aria-hidden="true"
                  />
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
