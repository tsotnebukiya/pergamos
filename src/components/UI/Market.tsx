import { markets } from "pergamos/utils/markets";

export const Market: React.FC<{ market: string }> = ({ market }) => {
  const marketUpper = market.toUpperCase();
  const marketLower = market.toLowerCase();
  return (
    <div className="flex space-x-2">
      <span
        className={`fi fi-${
          marketLower === "icsd"
            ? "un"
            : marketLower === "uk"
            ? "gb"
            : marketLower
        }`}
      />
      <span className="truncate font-medium">{marketUpper}</span>
    </div>
  );
};

export const marketsArr = markets.map((market) => {
  return { value: market, label: <Market market={market} /> };
});
