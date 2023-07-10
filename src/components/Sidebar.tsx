import {
  LayoutGrid,
  CreditCard,
  Landmark,
  UserCircle,
  Newspaper,
  ScrollText,
} from "lucide-react";

import { cn } from "pergamos/utils/utils";
import { Button } from "./UI/Button";
// import Logo from "./UI/Logo";
import Link from "next/link";
import { useRouter } from "next/router";
import { CardHeader } from "./UI/Card";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function Sidebar({ className }: SidebarProps) {
  const { pathname: currentPath } = useRouter();
  return (
    <div className="border-r lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className={cn("pb-12", className)}>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex cursor-default items-center px-10 py-2">
            <ScrollText className="mr-2 h-8 w-8" />
            <h2 className="text-2xl font-bold tracking-tight">Pergamos</h2>
          </div>

          <div className="px-4 py-2">
            <div className="space-y-1">
              <Link href={"/dashboard"}>
                <Button
                  variant={currentPath === "/dashboard" ? "secondary" : "ghost"}
                  size="lg"
                  className="w-full justify-start"
                >
                  <LayoutGrid className="mr-2 h-5 w-5" />
                  Home
                </Button>
              </Link>
              <Link href="/dashboard/payments">
                <Button
                  variant={
                    currentPath === "/dashboard/payments"
                      ? "secondary"
                      : "ghost"
                  }
                  size="lg"
                  className="w-full justify-start"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payments
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
                  <Landmark className="mr-2 h-5 w-5" />
                  Banks
                </Button>
              </Link>
              <Link href="/dashboard/brokers">
                <Button
                  variant={
                    currentPath === "/dashboard/brokers" ? "secondary" : "ghost"
                  }
                  size="lg"
                  className="w-full justify-start"
                >
                  <UserCircle className="mr-2 h-5 w-5" />
                  Brokers
                </Button>
              </Link>
              <Link href="/dashboard/ssi">
                <Button
                  variant={
                    currentPath === "/dashboard/ssi" ? "secondary" : "ghost"
                  }
                  size="lg"
                  className="w-full justify-start"
                >
                  <Newspaper className="mr-2 h-5 w-5" />
                  SSI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
