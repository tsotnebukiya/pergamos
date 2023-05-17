import MenuItem from "./MenuItem";

const teams = [
  { id: 1, name: "ICSD Income", href: "/", initial: "II" },
  { id: 2, name: "ICSD Lending", href: "/", initial: "IL" },
  { id: 3, name: "US Mandatory", href: "/", initial: "UM" },
];

const BottomMenu: React.FC<{ currentPath: string }> = ({ currentPath }) => {
  return (
    <>
      <div className="text-xs font-semibold leading-6 text-gray-400">
        Your teams
      </div>
      <ul role="list" className="-mx-2 mt-2 space-y-1">
        {teams.map((team) => (
          <li key={team.name}>
            <MenuItem
              href={team.href}
              name={team.name}
              initial={team.initial}
              current={currentPath === team.href}
              type="secondary"
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default BottomMenu;
