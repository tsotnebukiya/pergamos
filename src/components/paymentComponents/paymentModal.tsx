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
import { useRouter } from "next/router";

const PaymentModal: React.FC<{
  open: boolean;
  paymentId: number;
  type: "cancel" | "sendForApproval" | "reject" | "approve" | "approveOVT";
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen, paymentId, type }) => {
  const ctx = api.useContext();
  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { mutate: cancelMutate } = api.payments.cancel.useMutation({
    onSuccess: async () => {
      setOpen(false);
      setSubmitting(false);
      await router.push(`/dashboard/payments`);
      toast({
        variant: "default",
        title: "Success",
        description: "Payment cancelled",
      });
    },

    onError: (error) => {
      setOpen(false);
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  const { mutate: sendForApprovalMutate } =
    api.payments.sendForApproval.useMutation({
      onSuccess: () => {
        setOpen(false);
        setSubmitting(false);
        toast({
          variant: "default",
          title: "Success",
          description: "Sent for Approval",
        });
        void ctx.payments.getOne.invalidate({ id: paymentId });
      },
      onError: (error) => {
        setOpen(false);
        setSubmitting(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      },
    });
  const { mutate: approveMutate } = api.payments.approve.useMutation({
    onSuccess: (data) => {
      setOpen(false);
      setSubmitting(false);
      toast({
        variant: "default",
        title: "Success",
        description:
          data.status === "SENFOROVTAPPROVAL"
            ? "Approved. This is OVT payment, second checker must approve"
            : "Payment Approved",
      });
      void ctx.payments.getOne.invalidate({ id: paymentId });
    },
    onError: (error) => {
      setOpen(false);
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  const { mutate: approveOVTMutate } = api.payments.approveOVT.useMutation({
    onSuccess: () => {
      setOpen(false);
      setSubmitting(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Payment OVT Approved",
      });
      void ctx.payments.getOne.invalidate({ id: paymentId });
    },
    onError: (error) => {
      setOpen(false);
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  const { mutate: rejectMutate } = api.payments.reject.useMutation({
    onSuccess: () => {
      setOpen(false);
      setSubmitting(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Payment Rejected",
      });
      void ctx.payments.getOne.invalidate({ id: paymentId });
    },
    onError: (error) => {
      setOpen(false);
      setSubmitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
  const onCancel = () => {
    setSubmitting(true);
    cancelMutate({ id: paymentId });
  };
  const onSendForApproval = () => {
    setSubmitting(true);
    sendForApprovalMutate({ id: paymentId });
  };
  const onApprove = () => {
    setSubmitting(true);
    approveMutate({ id: paymentId });
  };
  const onOVTApprove = () => {
    setSubmitting(true);
    approveOVTMutate({ id: paymentId });
  };
  const onReject = () => {
    setSubmitting(true);
    rejectMutate({ id: paymentId });
  };
  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>
            {type === "cancel" && "Cancel Payment"}
            {type === "sendForApproval" && "Send for Approval"}
            {type === "approve" && "Approve Payment"}
            {type === "approveOVT" && "Approve OVT Payment"}
            {type === "reject" && "Reject Payment"}
          </DialogTitle>
          <DialogDescription>
            {type === "cancel" && "Are you sure you want to reject?"}
            {type === "sendForApproval" &&
              "Are you sure you want to send for approval?"}
            {type === "approve" && "Are you sure you want to approve payment?"}
            {type === "approveOVT" &&
              "Are you sure you want to approve OVT payment?"}
            {type === "reject" && "Are you sure you want to reject payment?"}
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
            {type === "cancel" && (
              <Button onClick={onCancel} disabled={submitting}>
                {submitting ? "Cancelling..." : "Cancel"}
              </Button>
            )}
            {type === "sendForApproval" && (
              <Button onClick={onSendForApproval} disabled={submitting}>
                {submitting ? "Sending..." : "Send For Approval"}
              </Button>
            )}
            {type === "approve" && (
              <Button onClick={onApprove} disabled={submitting}>
                {submitting ? "Approving..." : "Approve"}
              </Button>
            )}
            {type === "approveOVT" && (
              <Button onClick={onOVTApprove} disabled={submitting}>
                {submitting ? "Approving..." : "Approve OVT"}
              </Button>
            )}
            {type === "reject" && (
              <Button onClick={onReject} disabled={submitting}>
                {submitting ? "Rejecting..." : "Reject"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
