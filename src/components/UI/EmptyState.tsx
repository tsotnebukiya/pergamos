import { PlusIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import Link from "next/link";
import { useRouter } from "next/router";

const EmptyState: React.FC<{
  cardClass?: string;
  text: string;
  link?: string;
  action?: () => void;
}> = ({ cardClass, text, link, action }) => {
  const router = useRouter();
  const onClick = () => {
    if (link) {
      void router.push(link);
    }
    if (action) {
      action();
    }
  };
  return (
    <Card className={cardClass}>
      <CardContent>
        <div className="flex h-full flex-col justify-center text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No {text}s
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new {text}.
          </p>
          <div className="mt-6">
            <Button onClick={onClick}>
              New {text.charAt(0).toUpperCase() + text.slice(1)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
