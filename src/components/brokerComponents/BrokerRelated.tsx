const Related: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 border-none shadow-none md:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-2">
          Later
        </div>
        <div className="col-span-1 space-y-4 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-1">
          Later
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-6 lg:row-start-2 ">
          Later
        </div>
      </div>
    </div>
  );
};

export default Related;
