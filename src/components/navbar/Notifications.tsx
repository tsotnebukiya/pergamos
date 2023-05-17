import { BellIcon } from "@heroicons/react/24/outline";

const Notifications: React.FC = () => {
  return (
    <button
      type="button"
      className="flex-shrink-0 rounded-full p-1
   text-gray-400 hover:text-gray-500 
   focus:outline-none  
    dark:hover:text-white  
"
    >
      <span className="sr-only">View notifications</span>
      <BellIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
};

export default Notifications;
