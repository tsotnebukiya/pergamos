import { type RouterOutputs } from "pergamos/utils/api";
import BrokerDetails from "./BrokerDetails";
import BrokerContacts from "./BrokerContacts";



type Broker = RouterOutputs["brokers"]["getOne"];

const BrokerOverview: React.FC<{ broker: Broker }> = ({ broker }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 border-none shadow-none md:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-2">
          <BrokerContacts
            broker={broker}
          />
        </div>
        <BrokerDetails
          broker={broker}
          cardClass1="col-span-1 space-y-4 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-1"
          cardClass2="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-2"
        />
      </div>
    </div>
  );
};

export default BrokerOverview;
