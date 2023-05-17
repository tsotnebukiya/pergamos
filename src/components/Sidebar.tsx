import { HomeIcon, UsersIcon } from "@heroicons/react/24/outline";

import { cn } from "pergamos/utils/utils";
import { Button } from "./UI/Button";
// import Logo from "./UI/Logo";
import Link from "next/link";
import { useRouter } from "next/router";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
  const { pathname: currentPath } = useRouter();
  return (
    <div className="hidden border-r lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className={cn("pb-12", className)}>
        <div className="flex flex-col space-y-4 py-4">
          <div className="px-4 py-2">Logo</div>

          <div className="px-4 py-2">
            <div className="space-y-1">
              <Link href={"/dashboard"}>
                <Button
                  variant={currentPath === "/dashboard" ? "secondary" : "ghost"}
                  size="lg"
                  className="w-full justify-start"
                >
                  <HomeIcon className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
              <Link href="/dashboard/banks">
                <Button
                  variant={
                    currentPath === "/dashboard/banks" ? "secondary" : "ghost"
                  }
                  size="lg"
                  className="w-full justify-start"
                >
                  <UsersIcon className="mr-2 h-5 w-5" />
                  Banks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
