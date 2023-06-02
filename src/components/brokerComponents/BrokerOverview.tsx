import { type RouterOutputs } from "pergamos/utils/api";
import BrokerDetails from "./BrokerDetails";
import BrokerContacts from "./BrokerContacts";

const emailArr = [
  { text: "jpmorgan@gmail.com", id: "1" },
  { text: "goldmansachs@gmail.com", id: "2" },
  { text: "morganstanley@gmail.com", id: "3" },
  { text: "bankofamerica@gmail.com", id: "4" },
  { text: "citi@gmail.com", id: "5" },
  { text: "wellsfargo@gmail.com", id: "6" },
  { text: "usbank@gmail.com", id: "7" },
  { text: "capitalone@gmail.com", id: "8" },
  { text: "hsbc@gmail.com", id: "9" },
  { text: "barclays@gmail.com", id: "10" },
];

const phoneArr = [
  { text: "48-534-231 || John Doe", id: "1" },
  { text: "22-841-632 || Jane Smith", id: "2" },
  { text: "39-120-456 || Robert Johnson", id: "3" },
  { text: "98-215-876 || Emily Davis", id: "4" },
  { text: "67-389-124 ", id: "5" },
];

const accounts = [
  { text: "4231", id: "1" },
  { text: "4232", id: "2" },
];

type Broker = RouterOutputs["brokers"]["getOne"];

const BrokerOverview: React.FC<{ broker: Broker }> = ({ broker }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 border-none shadow-none md:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-2">
          <BrokerContacts
            accounts={accounts}
            emails={emailArr}
            phones={phoneArr}
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
