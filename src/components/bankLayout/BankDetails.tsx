import type { Bank } from "@prisma/client";
import Link from "next/link";
import { RouterOutputs } from "pergamos/utils/api";

const BankDetailsRow: React.FC<{
  heading: string;
  link: string;
  text: string;
  newWindow?: boolean;
}> = ({ heading, link, text, newWindow }) => {
  return (
    <div className="flex justify-between gap-x-4 py-3">
      <dt className="text-gray-500">{heading}</dt>
      <dd className="text-gray-700">
        <Link
          href={link}
          target={newWindow ? "_blank" : ""}
          className=" text-sm font-semibold leading-6 text-gray-900  hover:underline dark:text-gray-400"
        >
          {text}
        </Link>
      </dd>
    </div>
  );
};

type BankDetailsProps = RouterOutputs["banks"]["getOne"];

const BankDetails: React.FC<BankDetailsProps> = ({
  active,
  makerUser,
  checkerUser,
  website,
}) => {
  return (
    <>
      <div className="lg:col-start-3">
        <div className="rounded-xl border border-gray-200  shadow-lg dark:border-white/10">
          <div className="flex items-center justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6 dark:border-white/10 dark:bg-black/10">
            <div className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
              Details
            </div>
            <Badge
              text={active ? "Active" : "Inactive"}
              type={active ? "green" : "yellow"}
            />
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 dark:divide-white/10">
            <BankDetailsRow
              heading="Website"
              link={website}
              newWindow
              text={website}
            />
            <BankDetailsRow
              heading="Created By"
              link={`/dashboard/users/${makerUser.id}`}
              text={makerUser.name}
            />
            {checkerUser && (
              <BankDetailsRow
                heading="Approved By"
                link={`/dashboard/users/${checkerUser.id}`}
                text={checkerUser.name}
              />
            )}
          </dl>
        </div>
      </div>
    </>
  );
};

export default BankDetails;
