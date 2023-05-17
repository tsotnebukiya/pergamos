import { useRouter } from "next/router";
import Logo from "../UI/Logo";
import TopMenu from "./TopMenu";
import BottomMenu from "./BottomMenu";

const Sidebar: React.FC = () => {
  const { pathname: currentPath } = useRouter();
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div
        className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4 
      dark:border-none dark:bg-black/10 dark:ring-1 dark:ring-white/10 "
      >
        <Logo />
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <TopMenu currentPath={currentPath} />
            </li>
            <li>
              <BottomMenu currentPath={currentPath} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
