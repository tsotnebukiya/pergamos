import { type Dispatch, type SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../UI/Dialog";
import { Button } from "../UI/Button";
import { api } from "pergamos/utils/api";
import { useToast } from "pergamos/hooks/useToast";

const BrokerDeleteItem: React.FC<{
  open: boolean;
  itemId: string;
  brokerId: number;
  type: "Email" | "Account" | "Phone";
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen, itemId, brokerId, type }) => {
  const { toast } = useToast();
  const ctx = api.useContext();
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = api.brokers.deleteItem.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Item deleted successfully!",
      });
      void ctx.brokers.getOne.invalidate({ id: brokerId });
    },
    onError: (error) => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  const onActivate = () => {
    setSubmitting(true);
    mutate({ id: itemId, type: type });
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Delete {type}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="self-start"
              disabled={submitting}
            >
              Close
            </Button>
            <Button onClick={onActivate} disabled={submitting}>
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BrokerDeleteItem;
