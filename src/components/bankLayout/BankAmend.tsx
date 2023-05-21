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
import { useRouter } from "next/router";
import { regexUrl } from "pergamos/utils/utils";

const formSchema = z
  .object({
    website: z.string().regex(regexUrl, "Invalid URL").or(z.literal("")),
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .or(z.literal("")),
    _error: z.string().optional(),
  })
  .refine((value) => value.website !== "" || value.name !== "", {
    message: "At least one field must not be an empty string",
    path: ["_error"],
  });

const BankAmend: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const { bankId } = useRouter().query;
  const { toast } = useToast();
  const ctx = api.useContext();
  const [submitting, setSubmitting] = useState(false);

  const { mutate } = api.banks.amend.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Bank amended successfully",
      });
      void ctx.banks.getOne.invalidate({ id: Number(bankId) });
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
    defaultValues: {
      name: "",
      website: "",
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    setSubmitting(true);
    mutate({ bankId: Number(bankId), details: data });
  };
  return (
    <Sheet
      onOpenChange={(val) => {
        setOpen(val);
      }}
      open={open}
    >
      <SheetContent size={"sm"} onInteractOutside={() => setOpen(false)}>
        <SheetTitle className="py-6">Edit bank</SheetTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} required={false} />
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

export default BankAmend;
