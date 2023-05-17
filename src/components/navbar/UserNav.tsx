import {
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { Avatar, AvatarFallback, AvatarImage } from "../UI/Avatar";
import { Button } from "../UI/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../UI/DropDownMenu";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";

const UserNav: React.FC<User> = ({ email, image, name }) => {
  const logoutHandler = () => {
    void signOut();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative mr-2 h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {image && name && <AvatarImage src={image} alt={name} />}
            {!image && <AvatarFallback>SC</AvatarFallback>}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserCircleIcon className="mr-2 h-6 w-6" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <button onClick={logoutHandler} className="w-full">
          <DropdownMenuItem>
            <ArrowLeftOnRectangleIcon className="mr-2 h-6 w-6" />
            <span>Log out</span>
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
