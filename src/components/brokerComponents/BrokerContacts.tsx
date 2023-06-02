import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Separator } from "../UI/Separator";
import BrokerChipList from "./BrokerChipList";

const BrokerContacts: React.FC<{
  emails: { text: string; id: string }[];
  phones: { text: string; id: string }[];
  accounts: { text: string; id: string }[];
}> = ({ accounts, emails, phones }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emails</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-10 gap-2">
        <BrokerChipList
          arr={emails}
          onAdd={() => console.log("add")}
          onClick={(id) => console.log(id)}
        />
      </CardContent>
      <Separator orientation="horizontal" />
      <CardHeader>
        <CardTitle>Numbers</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-10 gap-2">
        <BrokerChipList
          arr={phones}
          onAdd={() => console.log("add")}
          onClick={(id) => console.log(id)}
        />
      </CardContent>
      <Separator orientation="horizontal" />
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-10 gap-2">
        <BrokerChipList
          arr={accounts}
          onAdd={() => console.log("add")}
          onClick={(id) => console.log(id)}
        />
      </CardContent>
    </Card>
  );
};

export default BrokerContacts;
