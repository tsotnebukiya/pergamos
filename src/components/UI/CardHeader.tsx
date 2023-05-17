const CardHeader: React.FC<{
  heading: string;
  children?: React.ReactNode;
}> = ({ heading, children }) => {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 dark:border-white/10 dark:bg-black/10 sm:px-6">
      <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div className="ml-4 mt-4">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {heading}
          </h3>
        </div>
        <div className="ml-4 mt-4 flex flex-shrink-0 gap-4">{children}</div>
      </div>
    </div>
  );
};

export default CardHeader;
