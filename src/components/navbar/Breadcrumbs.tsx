import { HomeIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

const BreadCrumbs: React.FC<{ pages: { name: string; href: string }[] }> = ({
  pages,
}) => {
  return (
    <nav
      className="flex border-b border-gray-200 bg-white dark:border-gray-800 dark:border-white/10 dark:bg-gray-900"
      aria-label="Breadcrumb"
    >
      <ol
        role="list"
        className="mx-auto flex w-full space-x-4 px-4 sm:px-6 lg:px-8"
      >
        <li className="flex">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name} className="flex">
            <div className="flex items-center">
              <svg
                className="h-full w-6 flex-shrink-0 text-gray-200 dark:text-white/10"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <Link
                href={page.href}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
