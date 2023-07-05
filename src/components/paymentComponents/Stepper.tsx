import { CheckIcon } from "lucide-react";
import { Card } from "../UI/Card";

const Stepper: React.FC<{
  status01: "complete" | "current" | "upcoming";
  status02: "complete" | "current" | "upcoming";
}> = ({ status01, status02 }) => {
  const steps = [
    { id: "01", name: "General", status: status01 },
    { id: "02", name: "Instructions", status: status02 },
  ];
  return (
    <nav aria-label="Progress">
      <Card className="flex">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.status === "complete" ? (
              <button className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                    <CheckIcon
                      className="h-6 w-6 text-secondary"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="ml-4 text-sm font-medium">{step.name}</span>
                </span>
              </button>
            ) : step.status === "current" ? (
              <button
                className="flex items-center px-6 py-4 text-sm font-medium"
                aria-current="step"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary">
                  <span className="text-primary">{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium">{step.name}</span>
              </button>
            ) : (
              <button className="group flex cursor-auto items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-border">
                    <span className="text-border">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-border">
                    {step.name}
                  </span>
                </span>
              </button>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                <div
                  className="absolute right-0 top-0 hidden h-full w-5 md:block"
                  aria-hidden="true"
                >
                  <svg
                    className="h-full w-full text-border"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </Card>
    </nav>
  );
};

export default Stepper;
