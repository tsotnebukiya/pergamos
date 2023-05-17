import Link from "next/link";
import { classNames } from "pergamos/utils/classNames";
import type { HeroIcon } from "pergamos/utils/types";

type MenuItemProps = {
  href: string;
  name: string;
  current: boolean;
  type: string;
  initial?: string;
  Icon?: HeroIcon;
};

const MenuItem: React.FC<MenuItemProps> = ({
  current,
  href,
  name,
  Icon,
  initial,
  type,
}) => {
  return (
    <Link
      href={href}
      className={classNames(
        current
          ? "bg-gray-50 text-indigo-600 dark:bg-gray-800 dark:text-white"
          : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
      )}
    >
      {Icon && type === "primary" && (
        <Icon
          className={classNames(
            current
              ? "dark: text-indigo-600 dark:text-white"
              : "text-gray-400 group-hover:text-indigo-600",
            "h-6 w-6 shrink-0 dark:text-gray-400 dark:group-hover:text-white"
          )}
          aria-hidden="true"
        />
      )}
      {initial && type === "secondary" && (
        <>
          <span
            className={classNames(
              current
                ? "border-indigo-600 text-indigo-600 "
                : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium",
              "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:border-gray-700 dark:group-hover:text-white"
            )}
          >
            {initial}
          </span>
          <span className="truncate">{name}</span>
        </>
      )}
      {type === "primary" && name}
    </Link>
  );
};

export default MenuItem;
