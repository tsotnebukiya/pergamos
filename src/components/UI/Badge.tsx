type BadgeType =
  | "gray"
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink";

interface BadgeProps {
  text: string;
  type: BadgeType;
}

const Badge: React.FC<BadgeProps> = ({ text, type }) => {
  const baseClass =
    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";
  const typeClasses: Record<BadgeType, string> = {
    gray: "bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-700 dark:text-gray-100 dark:ring-gray-900/10",
    red: "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-700 dark:text-red-100 dark:ring-red-900/10",
    yellow:
      "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-700 dark:text-yellow-100 dark:ring-yellow-900/20",
    green:
      "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-700 dark:text-green-100 dark:ring-green-900/20",
    blue: "bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-700 dark:text-blue-100 dark:ring-blue-900/10",
    indigo:
      "bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-700 dark:text-indigo-100 dark:ring-indigo-900/10",
    purple:
      "bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-700 dark:text-purple-100 dark:ring-purple-900/10",
    pink: "bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-700 dark:text-pink-100 dark:ring-pink-900/10",
  };

  const classes = `${baseClass} ${typeClasses[type]}`;

  return <span className={classes}>{text}</span>;
};

export default Badge;
