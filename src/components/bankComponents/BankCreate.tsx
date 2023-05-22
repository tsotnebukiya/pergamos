/* eslint-disable @typescript-eslint/no-misused-promises */
import { z } from "zod";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Sheet, SheetContent, SheetTitle } from "../UI/Sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useState } from "react";
import { api } from "pergamos/utils/api";
import { useToast } from "pergamos/hooks/useToast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../UI/Form";
import { regexUrl } from "pergamos/utils/utils";

const formSchema = z.object({
  website: z.string().regex(regexUrl, "Invalid URL"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
});

const BankCreate: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const ctx = api.useContext();
  const { mutate } = api.banks.create.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Bank created successfully",
      });
      void ctx.banks.getAll.invalidate();
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
    mode: "onSubmit",
    defaultValues: {
      name: "",
      website: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
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
        <SheetTitle className="py-6">Add bank</SheetTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
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
                disabled={submitting}
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
