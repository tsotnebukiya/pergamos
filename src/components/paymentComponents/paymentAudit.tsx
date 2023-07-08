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

type Payment = RouterOutputs["payments"]["getOne"];
type Activity = RouterOutputs["payments"]["getOne"]["audit"][number];

const AuditElement: React.FC<{
  activity: Activity;
  index: number;
  length: number;
}> = ({ activity, index, length }) => {
  const getRelativeTimeAgo = moment(activity.timestamp).fromNow();
  return (
    <li className="relative flex gap-x-4">
      <div
        className={cn(
          index === length - 1 ? "h-6" : "-bottom-6",
          "absolute left-0 top-0 flex w-6 justify-center"
        )}
      >
        <div className="w-px bg-border" />
      </div>

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
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          <span className="font-medium text-gray-900">
            <Link
              href={`dashboard/users/${activity.makerUser.id}`}
              className="items-start"
            >
              <Button variant="link" className="h-0 items-start p-0">
                {activity.makerUser.name}
              </Button>
            </Link>
          </span>{" "}
          {activity.type === "CREATE" && "created payment"}
          {activity.type === "SENDFORAPPROVAL" && "sent for approval"}
          {activity.type === "APPROVEDCHECKERI" && "approved I"}
          {activity.type === "APPROVEDCHECKERII" && "approved II"}
          {activity.type === "REJECT" && "rejected payment"}
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
const PaymentAudit: React.FC<{ data: Payment }> = ({ data }) => {
  const auditArr = data.audit.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  return (
    <>
      <ScrollArea className="h-[175px] ">
        <ul role="list" className="space-y-6">
          {auditArr.map((value, index) => (
            <AuditElement
              activity={value}
              index={index}
              key={index}
              length={auditArr.length}
            />
          ))}
        </ul>
      </ScrollArea>
    </>
  );
};

export default PaymentAudit;
