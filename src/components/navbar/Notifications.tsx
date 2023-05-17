import { BellIcon } from "@heroicons/react/24/outline";
import { Button } from "../newUI/Button";

const Notifications: React.FC = () => {
  return (
    <>
      <Button variant="ghost" size="sm" className="w-9 px-0">
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-6 w-6" aria-hidden="true" />
      </Button>
    </>
  );
};

export default Notifications;
