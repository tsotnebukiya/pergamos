import Link from "next/link";
import { Button } from "./UI/Button";
import { HomeIcon } from "@heroicons/react/24/outline";

const BreadCrumbs: React.FC<{ pages: { name: string; href: string }[] }> = ({
  pages,
}) => {
  return (
    <nav className="flex border-b" aria-label="Breadcrumb">
      <ol
        role="list"
        className=" mx-auto flex w-full space-x-4 px-4 sm:px-6 lg:px-8"
      >
        <li className="flex">
          <div className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost">
                <HomeIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </Button>
            </Link>
          </div>
        </li>
        {pages.map((page, index, array) => (
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

              <Link href={page.href} className="ml-4">
                <Button variant="ghost">{page.name}</Button>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
