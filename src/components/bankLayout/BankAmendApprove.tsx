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
import { Label } from "../UI/Label";
import { Input } from "../UI/Input";
import { api } from "pergamos/utils/api";
import { useToast } from "pergamos/hooks/useToast";

const BankApprove: React.FC<{
  open: boolean;
  amendId: number;
  bankId: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  name: string | null;
  website: string | null;
}> = ({ open, setOpen, name, website, bankId, amendId }) => {
  const { toast } = useToast();
  const ctx = api.useContext();
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = api.banks.amendChecker.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Bank amended successfully",
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
  const onApprove = () => {
    setSubmitting(true);
    mutate({ action: "APPROVE", bankId: bankId, amendId: amendId });
  };
  const onReject = () => {
    setSubmitting(true);
    mutate({ action: "REJECT", bankId: bankId, amendId: amendId });
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Approve changes</DialogTitle>
          <DialogDescription>List of pending changes:</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {name && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                value={name}
                className="col-span-3"
                readOnly
                tabIndex={-1}
              />
            </div>
          )}

          {website && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Website
              </Label>
              <Input
                value={website}
                className="col-span-3"
                readOnly
                tabIndex={-1}
              />
            </div>
          )}
        </div>
        <DialogFooter className="mt-5">
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="self-start"
              disabled={submitting}
            >
              Close
            </Button>
            <div className="flex gap-4">
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={submitting}
              >
                Reject
              </Button>
              <Button onClick={onApprove} disabled={submitting}>
                Approve
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BankApprove;
