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

const activity = [
  {
    id: 1,
    type: "created",
    person: { name: "Chelsea Hagon" },
    date: "7d ago",
    dateTime: "2023-01-23T10:32",
  },
  {
    id: 1,
    type: "created",
    person: { name: "Chelsea Hagon" },
    date: "7d ago",
    dateTime: "2023-01-23T10:32",
  },
  {
    id: 1,
    type: "created",
    person: { name: "Chelsea Hagon" },
    date: "7d ago",
    dateTime: "2023-01-23T10:32",
  },
  {
    id: 1,
    type: "created",
    person: { name: "Chelsea Hagon" },
    date: "7d ago",
    dateTime: "2023-01-23T10:32",
  },
  {
    id: 2,
    type: "edited",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:03",
  },
  {
    id: 3,
    type: "sent",
    person: { name: "Chelsea Hagon" },
    date: "6d ago",
    dateTime: "2023-01-23T11:24",
  },
  {
    id: 4,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    comment:
      "Called client, they reassured me the invoice would be paid by the 25th.",
    date: "3d ago",
    dateTime: "2023-01-23T15:56",
  },
  {
    id: 5,
    type: "viewed",
    person: { name: "Alex Curren" },
    date: "2d ago",
    dateTime: "2023-01-24T09:12",
  },
  {
    id: 6,
    type: "paid",
    person: { name: "Alex Curren" },
    date: "1d ago",
    dateTime: "2023-01-24T09:20",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type Payment = RouterOutputs["payments"]["getOne"];
type Activity = RouterOutputs["payments"]["getOne"]["audit"][number];

const dummy: Activity[] = [
  {
    id: "1",
    makerUser: { id: "2", name: "Jack Fine", image: null },
    type: "CREATE",
    timestamp: new Date(2023, 6, 6, 12, 0, 0),
    payment: 1,
    maker: "Jack Fine",
    comment: null,
  },
  {
    id: "2",
    makerUser: { id: "2", name: "Jack Fine", image: null },
    type: "SENDFORAPPROVAL",
    timestamp: new Date(2023, 6, 6, 13, 0, 0),
    payment: 1,
    maker: "Jack Fine",
    comment: null,
  },
  {
    id: "3",
    makerUser: { id: "1", name: "Kate Doe", image: null },
    type: "COMMENT",
    timestamp: new Date(2023, 6, 6, 15, 0, 0),
    payment: 1,
    maker: "Kate Doe",
    comment: "Some Comment",
  },
  {
    id: "4",
    makerUser: { id: "1", name: "Kate Doe", image: null },
    type: "APPROVEDCHECKERI",
    timestamp: new Date(2023, 6, 6, 17, 0, 0),
    payment: 1,
    maker: "Kate Doe",
    comment: null,
  },
  {
    id: "5",
    makerUser: { id: "3", name: "John Kent", image: null },
    type: "APPROVEDCHECKERII",
    timestamp: new Date(2023, 6, 6, 22, 0, 0),
    payment: 1,
    maker: "John Kent",
    comment: null,
  },
  {
    id: "6",
    makerUser: { id: "4", name: "Kaleb Stiffler", image: null },
    type: "REJECT",
    timestamp: new Date(2023, 6, 7, 17, 0, 0),
    payment: 1,
    maker: "Kaleb Stiffler",
    comment: null,
  },
];
const AuditElement: React.FC<{ activity: Activity; index: number }> = ({
  activity,
  index,
}) => {
  const getRelativeTimeAgo = moment(activity.timestamp).fromNow();
  return (
    <li className="relative flex gap-x-4">
      <div
        className={cn(
          index === 0 ? "h-6" : "-bottom-6",
          "absolute left-0 top-0 flex w-6 justify-center"
        )}
      >
        <div className="w-px bg-border" />
      </div>
      {activity.type === "COMMENT" && (
        <>
          <Avatar className="h-6 w-6">
            {activity.makerUser.image ? (
              <Image
                src={activity.makerUser.image || ""}
                alt=""
                className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
              />
            ) : (
              <AvatarFallback />
            )}
          </Avatar>

          <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
            <div className="flex justify-between gap-x-4">
              <div className="py-0.5 text-xs leading-5 text-gray-500">
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
                commented
              </div>
              <time
                dateTime={activity.timestamp.toDateString()}
                className="flex-none py-0.5 text-xs leading-5 text-gray-500"
              >
                {getRelativeTimeAgo}
              </time>
            </div>
            <p className="text-sm leading-6 text-gray-500">
              {activity.comment}
            </p>
          </div>
        </>
      )}
      {activity.type !== "COMMENT" && (
        <>
          <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
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
          <time
            dateTime={activity.timestamp.toDateString()}
            className="flex-none py-0.5 text-xs leading-5 text-gray-500"
          >
            {getRelativeTimeAgo}
          </time>
        </>
      )}
    </li>
  );
};
const PaymentAudit: React.FC<{ data: Payment }> = ({ data }) => {
  const auditArr = data.audit.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  return (
    <>
      <ul role="list" className="space-y-6">
        {dummy.map((value, index) => (
          <AuditElement activity={value} index={index} key={index} />
        ))}
        {/* {activity.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                activityItemIdx === activity.length - 1 ? "h-6" : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center"
              )}
            >
              <div className="w-px bg-border" />
            </div>
            {activityItem.type === "commented" ? (
              <>
                <img
                  src={activityItem.person.imageUrl}
                  alt=""
                  className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                />
                <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                  <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-xs leading-5 text-gray-500">
                      <span className="font-medium text-gray-900">
                        {activityItem.person.name}
                      </span>{" "}
                      commented
                    </div>
                    <time
                      dateTime={activityItem.dateTime}
                      className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                    >
                      {activityItem.date}
                    </time>
                  </div>
                  <p className="text-sm leading-6 text-gray-500">
                    {activityItem.comment}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                  {activityItem.type === "paid" ? (
                    <CheckCircleIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                  )}
                </div>
                <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                  <span className="font-medium text-gray-900">
                    {activityItem.person.name}
                  </span>{" "}
                  {activityItem.type} the invoice.
                </p>
                <time
                  dateTime={activityItem.dateTime}
                  className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                >
                  {activityItem.date}
                </time>
              </>
            )}
          </li>
        ))} */}
      </ul>

      {/* New comment form */}
      {/* <div className="mt-6 flex gap-x-3">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
          className="h-6 w-6 flex-none rounded-full bg-gray-50"
        />
        <form action="#" className="relative flex-auto">
          <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={2}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              defaultValue={""}
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
              <div className="flex items-center">
                <Listbox value={selected} onChange={setSelected}>
                  {({ open }) => (
                    <>
                      <Listbox.Label className="sr-only">
                        Your mood
                      </Listbox.Label>
                      <div className="relative">
                        <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                          <span className="flex items-center justify-center">
                            {selected.value === null ? (
                              <span>
                                <FaceSmileIcon
                                  className="h-5 w-5 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">Add your mood</span>
                              </span>
                            ) : (
                              <span>
                                <span
                                  className={classNames(
                                    selected.bgColor,
                                    "flex h-8 w-8 items-center justify-center rounded-full"
                                  )}
                                >
                                  <selected.icon
                                    className="h-5 w-5 flex-shrink-0 text-white"
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="sr-only">{selected.name}</span>
                              </span>
                            )}
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute bottom-10 z-10 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                            {moods.map((mood) => (
                              <Listbox.Option
                                key={mood.value}
                                className={({ active }) =>
                                  classNames(
                                    active ? "bg-gray-100" : "bg-white",
                                    "relative cursor-default select-none px-3 py-2"
                                  )
                                }
                                value={mood}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={classNames(
                                      mood.bgColor,
                                      "flex h-8 w-8 items-center justify-center rounded-full"
                                    )}
                                  >
                                    <mood.icon
                                      className={classNames(
                                        mood.iconColor,
                                        "h-5 w-5 flex-shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <span className="ml-3 block truncate font-medium">
                                    {mood.name}
                                  </span>
                                </div>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Comment
            </button>
          </div>
        </form>
      </div> */}
    </>
  );
};

export default PaymentAudit;
