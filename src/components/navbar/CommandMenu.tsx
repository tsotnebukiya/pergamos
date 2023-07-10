/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../UI/Command";
import { Dispatch, SetStateAction, useState } from "react";
import {
  LayoutGrid,
  CreditCard,
  Landmark,
  UserCircle,
  Newspaper,
  ScrollText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import BankCreate from "../bankComponents/BankCreate";
import BrokerCreate from "../brokerComponents/BrokerCreate";

const CommandMenu: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const [openBank, setOpenBank] = useState(false);
  const [openBroker, setOpenBroker] = useState(false);
  const router = useRouter();
  const paymentHandler = async () => {
    setOpen(false);
    await router.push("/dashboard/payments/newpayment");
  };
  const ssiHandler = async () => {
    setOpen(false);
    await router.push("/dashboard/ssi/newssi");
  };
  const bankHandler = () => {
    setOpen(false);
    setOpenBank(true);
  };
  const brokerHandler = () => {
    setOpen(false);
    setOpenBroker(true);
  };
  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          {/* <CommandEmpty>No results found.</CommandEmpty> */}
          <CommandGroup heading="Actions">
            <CommandItem onSelect={paymentHandler}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>New Payment</span>
            </CommandItem>
            <CommandItem onSelect={bankHandler}>
              <Landmark className="mr-2 h-4 w-4" />
              <span>New Bank</span>
            </CommandItem>
            <CommandItem onSelect={brokerHandler}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>New Broker</span>
            </CommandItem>
            <CommandItem onSelect={ssiHandler}>
              <Newspaper className="mr-2 h-4 w-4" />
              <span>New SSI</span>
            </CommandItem>
          </CommandGroup>
          {/* <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <PersonIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
          <span>Mail</span>
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <GearIcon className="mr-2 h-4 w-4" />
          <span>Settings</span>
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup> */}
        </CommandList>
      </CommandDialog>
      <BankCreate open={openBank} setOpen={setOpenBank} />
      <BrokerCreate open={openBroker} setOpen={setOpenBroker} />
    </>
  );
};

export default CommandMenu;
