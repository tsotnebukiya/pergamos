import { Badge } from "./Badge";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useToast } from "pergamos/hooks/useToast";
import { X } from "lucide-react";

export const Chip: React.FC<{
  text: string;
  id: string;
  onClick: (id: string) => void;
}> = ({ text, id, onClick }) => {
  const { toast } = useToast();
  const onCopyText = () => {
    toast({ title: "Copied!" });
  };
  return (
    <Badge className={`flex items-center rounded-sm py-1`} variant="secondary">
      <CopyToClipboard text={text} onCopy={onCopyText}>
        <span> {text}</span>
      </CopyToClipboard>
      <X
        className="ml-1 cursor-pointer"
        width={16}
        height={16}
        onClick={() => onClick(id)}
      />
    </Badge>
  );
};

export const ChipList: React.FC<{
  arr: { text: string; id: string }[];
  onClick: (id: string) => void;
}> = ({ arr, onClick }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {arr.map((el) => (
        <Chip id={el.id} text={el.text} key={el.id} onClick={onClick} />
      ))}
    </div>
  );
};
