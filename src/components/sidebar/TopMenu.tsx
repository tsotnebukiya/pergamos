import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import MenuItem from "./MenuItem";
import DropDownItem from "./DropDownItem";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Contact List",
    icon: UsersIcon,
    subitems: [
      { name: "Banks", href: "/dashboard/banks" },
      { name: "Brokers", href: "/dashboard/banks/brokers" },
    ],
  },
  {
    name: "Projects",
    icon: FolderIcon,
    href: "/dashboard/projects",
  },
  { name: "Calendar", href: "#", icon: CalendarIcon },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon },
  { name: "Reports", href: "#", icon: ChartPieIcon },
];

const TopMenu: React.FC<{ currentPath: string }> = ({ currentPath }) => {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          {item.href && !item.subitems && (
            <MenuItem
              href={item.href}
              name={item.name}
              Icon={item.icon}
              current={currentPath === item.href}
              type="primary"
            />
          )}
          {!item.href && item.subitems && (
            <DropDownItem
              Icon={item.icon}
              name={item.name}
              subitems={item.subitems}
              currentPath={currentPath}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export default TopMenu;
