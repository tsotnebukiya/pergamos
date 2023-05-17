import { Search } from "./Search";
import type { User } from "next-auth";
import { ModeToggle } from "../ToggleTheme";
import Notifications from "./Notifications";
import UserNav from "./UserNav";

const Nav: React.FC<{
  user: User;
}> = ({ user }) => {
  return (
    <div
      className="sticky top-0 z-50
     flex h-16 shrink-0 items-center border-b  bg-background px-4"
    >
      <div className="flex w-full items-center gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 justify-center">
          <Search />
        </div>

        <div className="flex items-center gap-x-4">
          <ModeToggle />
          <Notifications />
          <div
            className="hidden  border-l lg:block lg:h-8 lg:w-px"
            aria-hidden="true"
          />
          <UserNav {...user} />
        </div>
      </div>
    </div>
  );
};

export default Nav;
