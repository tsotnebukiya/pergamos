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

const BankActivate: React.FC<{
  open: boolean;
  bankId: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen, bankId }) => {
  const { toast } = useToast();
  const ctx = api.useContext();
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = api.banks.activate.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Bank activated",
      });
      void ctx.banks.getOne.invalidate({ id: bankId });
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
    mutate({ id: bankId });
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Activate Bank</DialogTitle>
          <DialogDescription>
            Are you sure you want to activate?
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
              Activate
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BankActivate;
