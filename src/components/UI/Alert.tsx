import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

type AlertType = "success" | "error" | "warning" | "info";

type AlertProps = {
  text: string;
  type: AlertType;
};

const styles = (type: AlertType) => {
  switch (type) {
    case "success":
      return "green";
    case "error":
      return "red";
    case "warning":
      return "yellow";
    case "info":
      return "blue";
  }
};

const Alert: React.FC<AlertProps> = ({ text, type }) => {
  const color = styles(type);
  return (
    <div
      className={`border-l-4 border-${color}-400 bg-${color}-50 p-4 dark:border-gray-700 dark:bg-gray-800`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {color === "yellow" && (
            <ExclamationTriangleIcon
              className={`h-5 w-5 text-yellow-400 dark:text-yellow-500`}
              aria-hidden="true"
            />
          )}
          {color === "green" && (
            <CheckCircleIcon
              className={`h-5 w-5 text-green-400 dark:text-green-500`}
              aria-hidden="true"
            />
          )}
          {color === "red" && (
            <XCircleIcon
              className={`h-5 w-5 text-red-400 dark:text-red-500`}
              aria-hidden="true"
            />
          )}
          {color === "blue" && (
            <InformationCircleIcon
              className={`h-5 w-5 text-blue-400 dark:text-blue-500`}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm text-${color}-700 dark:text-white`}>
            {text}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Alert;
