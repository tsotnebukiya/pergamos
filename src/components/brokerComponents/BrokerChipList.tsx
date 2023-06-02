import CopyToClipboard from "react-copy-to-clipboard";
import { Button } from "../UI/Button";
import { useToast } from "pergamos/hooks/useToast";
import { ChipList } from "../UI/Chip";

const BrokerChipList: React.FC<{
  arr: { text: string; id: string }[];
  onClick: (id: string) => void;
  onAdd: () => void;
}> = ({ arr, onClick, onAdd }) => {
  const { toast } = useToast();
  return (
    <>
      <div className="col-span-9">
        {arr.length > 0 ? <ChipList arr={arr} onClick={onClick} /> : "No items"}
      </div>
      <div className="col-span-1 flex items-center">
        <div className="flex flex-col gap-3">
          {arr.length > 0 && (
            <CopyToClipboard
              text={arr.map((item) => item.text).join(" ")}
              onCopy={() => toast({ title: "Copied" })}
            >
              <Button variant="outline" size="sm">
                Copy
              </Button>
            </CopyToClipboard>
          )}

          <Button variant="default" size="sm" onClick={onAdd}>
            Add
          </Button>
        </div>
      </div>
    </>
  );
};

export default BrokerChipList;
