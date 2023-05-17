import {
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import type { Toast } from "react-hot-toast";
import toast from "react-hot-toast";

const Notify: React.FC<{
  t: Toast;
  type: "success" | "error" | "info" | "warn";
  text?: string;
}> = ({ t, type, text }) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg
    ring-1 ring-black ring-opacity-5 dark:bg-gray-900 dark:ring-white/10 dark:ring-opacity-10`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {type === "success" && (
              <CheckCircleIcon
                className="h-6 w-6 text-green-400"
                aria-hidden="true"
              />
            )}
            {type === "error" && (
              <XCircleIcon
                className={`h-6 w-6 text-red-400`}
                aria-hidden="true"
              />
            )}
            {type === "info" && (
              <InformationCircleIcon
                className={`h-6 w-6 text-blue-400`}
                aria-hidden="true"
              />
            )}
            {type === "warn" && (
              <ExclamationTriangleIcon
                className={`h-6 w-6 text-yellow-400`}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
            {text && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {text}
              </p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-900 dark:text-gray-200 dark:hover:text-gray-300 dark:focus:ring-indigo-400"
              onClick={() => {
                toast.dismiss(t.id);
              }}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notify;
