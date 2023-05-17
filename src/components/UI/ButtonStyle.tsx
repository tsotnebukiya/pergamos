import Link from "next/link";
import Spinner from "./Spinner";

const ButtonStyle: React.FC<{
  text: string;
  type?: "primary" | "secondary";
  size?: "small" | "medium" | "large" | "xlarge";
  spinner?: boolean;
}> = ({ text, type = "primary", size = "medium", spinner }) => {
  const baseClasses =
    "rounded font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 flex items-center gap-2";

  const sizeClasses = {
    small: "px-2 py-1 text-xs",
    medium: "px-2.5 py-1.5 text-sm",
    large: "px-3 py-2 text-sm",
    xlarge: "px-3.5 py-2.5 text-sm",
  };

  const primaryClasses =
    "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600 text-white dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500";

  const secondaryClasses =
    "bg-white hover:bg-gray-50 ring-1 ring-inset ring-gray-300 text-gray-900 dark:ring-0 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:bg-white/20";

  const buttonClasses =
    type === "primary"
      ? `${baseClasses} ${primaryClasses} ${sizeClasses[size]}`
      : `${baseClasses} ${secondaryClasses} ${sizeClasses[size]}`;

  return (
    <div className={buttonClasses}>
      {spinner && <Spinner />}
      {text}
    </div>
  );
};

export default ButtonStyle;
