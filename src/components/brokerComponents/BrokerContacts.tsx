import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/Card";
import { Separator } from "../UI/Separator";
import BrokerChipList from "./BrokerChipList";
import { type RouterOutputs } from "pergamos/utils/api";
import BrokerAddItems from "./BrokerAddItems";
import BrokerDeleteItem from "./BrokerDeleteItem";

type Broker = RouterOutputs["brokers"]["getOne"];

const BrokerContacts: React.FC<{
  broker: Broker;
}> = ({ broker }) => {
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [type, setType] = useState<"Email" | "Account" | "Phone">("Email");
  const [deleteType, setDeleteType] = useState<"Email" | "Account" | "Phone">(
    "Email"
  );
  const [itemId, setItemId] = useState("");
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Emails</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-10 gap-2">
          <BrokerChipList
            arr={broker.contactEmails.map((email) => ({
              id: email.id,
              text: email.email,
            }))}
            onAdd={() => {
              setType("Email");
              setAddOpen(true);
            }}
            onClick={(id) => {
              setItemId(id);
              setDeleteType("Email");
              setDeleteOpen(true);
            }}
          />
        </CardContent>
        <Separator orientation="horizontal" />
        <CardHeader>
          <CardTitle>Phone Numbers</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-10 gap-2">
          <BrokerChipList
            arr={broker.contactPhones.map((phone) => ({
              id: phone.id,
              text: phone.phone,
            }))}
            onAdd={() => {
              setType("Phone");
              setAddOpen(true);
            }}
            onClick={(id) => {
              setItemId(id);
              setDeleteType("Phone");
              setDeleteOpen(true);
            }}
          />
        </CardContent>
        <Separator orientation="horizontal" />
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-10 gap-2">
          <BrokerChipList
            arr={broker.accounts.map((account) => ({
              id: account.id,
              text: account.account,
            }))}
            onAdd={() => {
              setType("Account");
              setAddOpen(true);
            }}
            onClick={(id) => {
              setItemId(id);
              setDeleteType("Account");
              setDeleteOpen(true);
            }}
          />
        </CardContent>
      </Card>
      {addOpen && (
        <BrokerAddItems
          open={addOpen}
          setOpen={setAddOpen}
          brokerId={broker.id}
          type={type}
        />
      )}
      {deleteOpen && (
        <BrokerDeleteItem
          open={deleteOpen}
          setOpen={setDeleteOpen}
          brokerId={broker.id}
          itemId={itemId}
          type={deleteType}
        />
      )}
    </>
  );
};

export default BrokerContacts;
