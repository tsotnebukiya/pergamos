import type { User } from "next-auth";
import ToggleTheme from "../UI/ToggleTheme";
import Notifications from "./Notifications";
import UserMenu from "./UserMenu";

const UserActions: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex items-center gap-x-4 lg:gap-x-6">
      <ToggleTheme />
      <Notifications />
      <div
        className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-300 dark:lg:bg-gray-600"
        aria-hidden="true"
      />
      <UserMenu user={user} />
    </div>
  );
};

export default UserActions;
