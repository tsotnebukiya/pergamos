import { type RouterOutputs } from "pergamos/utils/api";
import { Fragment, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  CheckCircle,
  CheckCircle2,
  Check,
  Send,
  CheckCircle2Icon,
  CheckSquare,
  CheckSquareIcon,
  CheckCheckIcon,
  MessageCircle,
  XCircle,
  FilePlus2,
} from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import { cn } from "pergamos/utils/utils";
import Link from "next/link";
import { Button } from "../UI/Button";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../UI/Avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../UI/Tooltip";
import { ScrollArea } from "../UI/ScrollArea";
import { Input } from "../UI/Input";

type Activity = RouterOutputs["payments"]["getOne"]["audit"][number];
type Audit = RouterOutputs["payments"]["getOne"]["audit"];
const AuditElement: React.FC<{
  activity: Activity;
  index: number;
  length: number;
  dashboard?: boolean;
}> = ({ activity, index, length, dashboard }) => {
  const getRelativeTimeAgo = moment(activity.timestamp).fromNow();
  return (
    <li className="relative flex gap-x-4">
      {!dashboard && (
        <div
          className={cn(
            index === length - 1 ? "h-6" : "-bottom-6",
            "absolute left-0 top-0 flex w-6 justify-center"
          )}
        >
          <div className="w-px bg-border" />
        </div>
      )}

      {dashboard && (
        <Link
          href={`dashboard/payments/${activity.payment}`}
          className="items-start"
        >
          <Button variant="link" className="mr-6 h-0 w-20 items-start p-0">
            PM-{activity.payment}
          </Button>
        </Link>
      )}
      <>
        <div className="justify-cente relative flex h-6 w-6 flex-none items-center">
          {activity.type === "CREATE" && (
            <FilePlus2 className="h-6 w-6" aria-hidden="true" />
          )}
          {activity.type === "APPROVEDCHECKERI" && (
            <CheckCircle className="h-6 w-6" aria-hidden="true" />
          )}
          {activity.type === "APPROVEDCHECKERII" && (
            <CheckSquare className="h-6 w-6" aria-hidden="true" />
          )}
          {activity.type === "REJECT" && (
            <XCircle className="h-6 w-6" aria-hidden="true" />
          )}
          {activity.type === "SENDFORAPPROVAL" && (
            <Send className="h-6 w-6" aria-hidden="true" />
          )}
        </div>
        <p className="flex-auto py-0.5 text-xs leading-5">
          <span className="font-medium">
            <Link
              href={`dashboard/users/${activity.makerUser.id}`}
              className="items-start"
            >
              <Button variant="link" className="h-0 items-start p-0">
                {activity.makerUser.name}
              </Button>
            </Link>
          </span>
          {activity.type === "CREATE" && " created payment"}
          {activity.type === "SENDFORAPPROVAL" && " sent for approval"}
          {activity.type === "APPROVEDCHECKERI" && " approved payment"}
          {activity.type === "APPROVEDCHECKERII" && " approved OVT"}
          {activity.type === "REJECT" && " rejected payment"}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex-none py-0.5 text-xs leading-5 text-gray-500">
              {getRelativeTimeAgo}
            </TooltipTrigger>
            <TooltipContent>{activity.timestamp.toString()}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </>
    </li>
  );
};
const PaymentAudit: React.FC<{ data: Audit; dashboard?: boolean }> = ({
  data,
  dashboard,
}) => {
  const auditArr = data.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  return (
    <>
      {dashboard ? (
        <ul role="list" className="space-y-6">
          {auditArr.map((value, index) => (
            <AuditElement
              activity={value}
              index={index}
              key={index}
              length={auditArr.length}
              dashboard={dashboard}
            />
          ))}
        </ul>
      ) : (
        <ScrollArea className="h-[175px]">
          <ul role="list" className="space-y-6">
            {auditArr.map((value, index) => (
              <AuditElement
                activity={value}
                index={index}
                key={index}
                length={auditArr.length}
                dashboard={dashboard}
              />
            ))}
          </ul>
        </ScrollArea>
      )}
    </>
  );
};

export default PaymentAudit;
