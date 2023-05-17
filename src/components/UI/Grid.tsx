const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none custom:grid-cols-3">
        {children}
      </div>
    </div>
  );
};

export default Grid;
