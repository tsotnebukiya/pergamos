import type { Dispatch, SetStateAction } from "react";
import Search from "./Search";
import UserActions from "./UserActions";
import type { User } from "next-auth";

const Nav: React.FC<{
  user: User;
  onOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ user }) => {
  return (
    <div
      className="sticky top-0 z-40
     flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm 
     dark:border-white/10 dark:bg-black/10    sm:gap-x-6 sm:px-6 lg:px-8"
    >
      {/*
       MobileMenuButton 
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-400 lg:hidden"
        onClick={() => onOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" /> */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <Search />
        <UserActions user={user} />
      </div>
    </div>
  );
};

export default Nav;
