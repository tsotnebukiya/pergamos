import { classNames } from "pergamos/utils/classNames";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import type { HeroIcon } from "pergamos/utils/types";
import Link from "next/link";

const DropDownItem: React.FC<{
  name: string;
  Icon: HeroIcon;
  currentPath: string;
  subitems: {
    name: string;
    href: string;
  }[];
}> = ({ name, Icon, subitems, currentPath }) => {
  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(
              subitems.some((subitem) => currentPath.startsWith(subitem.href))
                ? "bg-gray-50 text-indigo-600 dark:bg-gray-800 dark:text-white"
                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
              "group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6"
            )}
          >
            <Icon
              className={classNames(
                subitems.some((subitem) => currentPath.startsWith(subitem.href))
                  ? "text-indigo-600 dark:text-white"
                  : "text-gray-400 group-hover:text-indigo-600",
                "h-6 w-6 shrink-0 dark:text-gray-400 dark:group-hover:text-white"
              )}
              aria-hidden="true"
            />
            {name}
            <ChevronRightIcon
              className={classNames(
                open ? "rotate-90 text-gray-500" : "text-gray-400",
                "ml-auto h-5 w-5 shrink-0"
              )}
              aria-hidden="true"
            />
          </Disclosure.Button>
          <Disclosure.Panel as="ul" className="mt-1 px-2">
            {subitems.map((subItem) => (
              <li key={subItem.name}>
                <Link
                  href={subItem.href}
                  className={classNames(
                    subItem.href === currentPath
                      ? "bg-gray-50 text-indigo-600 dark:bg-gray-800 dark:text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                    "block w-full rounded-md py-2 pl-9 pr-2 text-left text-sm leading-6"
                  )}
                >
                  {subItem.name}
                </Link>
              </li>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default DropDownItem;
