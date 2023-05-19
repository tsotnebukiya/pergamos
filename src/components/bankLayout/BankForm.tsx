/* eslint-disable @typescript-eslint/no-misused-promises */
import { z } from "zod";
import { Button } from "../UI/Button";
import { CardContent, CardFooter } from "../UI/Card";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Close as SheetClose } from "@radix-ui/react-dialog";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../UI/Sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "../UI/Alert";
import { Dispatch, SetStateAction, useState } from "react";
import { api } from "pergamos/utils/api";
import { useToast } from "pergamos/hooks/useToast";

export const urlRegex =
  /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

const schema = z.object({
  website: z.string().regex(urlRegex, "Invalid URL"),
  name: z.string().min(5, "Name must be at least 3 characters long"),
});

export type BankForm = z.infer<typeof schema>;

const BankForm: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const { toast } = useToast();
  const [submitting, isSubmitting] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<BankForm>({
    resolver: zodResolver(schema),
    mode: "onBlur",

    defaultValues: {
      name: "",
      website: "",
    },
  });
  const { mutate } = api.banks.create.useMutation({
    onSettled: () => {
      isSubmitting(false);
      setOpen(false);
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success",
        description: "Bank created successfully",
      });
      // void router.push(`/dashboard/banks/${val.id}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit: SubmitHandler<BankForm> = (data) => {
    mutate(data);
  };
  return (
    <Sheet
      onOpenChange={(val) => {
        setOpen(val);
        reset();
      }}
      open={open}
    >
      <SheetContent size={"sm"} onInteractOutside={() => setOpen(false)}>
        <SheetTitle className="p-6">Add bank</SheetTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input placeholder="Bank Name" required {...field} />
                  )}
                />
                {errors.name && open && (
                  <Alert variant={"destructive"} className="mt-1">
                    {errors.name.message}
                  </Alert>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="https://website.com/"
                      required
                      {...field}
                    />
                  )}
                />
                {errors.website && open && (
                  <Alert variant={"destructive"} className="mt-1">
                    {errors.website.message}
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between space-x-2">
              <Button variant="outline" asChild>
                <button type="button" onMouseDown={() => setOpen(false)}>
                  Close
                </button>
              </Button>
              <Button type="submit" disabled={submitting}>
                <div className="flex items-center gap-2">
                  {submitting ? "Submitting" : "Submit"}
                </div>
              </Button>
            </CardFooter>
          </SheetHeader>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default BankForm;
