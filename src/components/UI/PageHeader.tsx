import Image from "next/image";

const PageHeader: React.FC<{
  heading: string;
  image?: string;
  children?: React.ReactNode;
}> = ({ heading, image, children }) => {
  return (
    <header className="relative isolate">
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 bottom-0 h-px border-b border-gray-200  dark:border-white/10" />
      </div>
      <div className="mx-auto max-w-7xl  px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
          <div className="flex items-center gap-x-6">
            {image && (
              <Image
                src={image}
                alt="Header Logo"
                width={24}
                height={24}
                className="h-16 w-16 flex-none rounded-full ring-1 ring-gray-900/10 "
              />
            )}

            <h1>
              <div className="mt-1 text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
                {heading}
              </div>
            </h1>
          </div>
          {children && (
            <div className="flex items-center gap-x-4 sm:gap-x-6">
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
