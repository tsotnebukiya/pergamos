/* eslint-disable @typescript-eslint/no-misused-promises */
import { z } from "zod";
import { Button } from "../UI/Button";
import { CardContent, CardFooter } from "../UI/Card";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../UI/Sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "../UI/Alert";
import { Dispatch, SetStateAction, useState } from "react";
import { api } from "pergamos/utils/api";
import { useToast } from "pergamos/hooks/useToast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../UI/Form";

export const urlRegex =
  /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

const schema = z.object({
  website: z.string().regex(urlRegex, "Invalid URL"),
  name: z.string().min(5, "Name must be at least 3 characters long"),
});

export type BankForm = z.infer<typeof schema>;

const formSchema = z.object({
  website: z.string().regex(urlRegex, "Invalid URL"),
  name: z.string().min(5, "Name must be at least 3 characters long"),
});

const BankCreate: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = api.banks.create.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Bank created successfully",
      });
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<BankForm> = (data) => {
    setSubmitting(true);
    mutate(data);
  };
  return (
    <Sheet
      onOpenChange={(val) => {
        setOpen(val);
      }}
      open={open}
    >
      <SheetContent size={"sm"} onInteractOutside={() => setOpen(false)}>
        <SheetTitle className="p-6">Add bank</SheetTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://website.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onMouseDown={() => setOpen(false)}
              >
                Close
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default BankCreate;
