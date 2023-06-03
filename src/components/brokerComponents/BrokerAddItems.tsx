/* eslint-disable @typescript-eslint/no-misused-promises */
import { z } from "zod";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { useForm, type SubmitHandler, useFieldArray } from "react-hook-form";
import { Sheet, SheetContent, SheetTitle } from "../UI/Sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, type SetStateAction, useState } from "react";
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
import { cn } from "pergamos/utils/utils";

const phoneRegex =
  /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const accountSchema = z.object({
  Account: z.array(
    z.object({
      value: z
        .string()
        .refine((value) => value !== "", "Please enter Account")
        .refine((value) => {
          const numValue = Number(value);
          return !isNaN(numValue) && numValue > 0 && Number.isInteger(numValue);
        }, "Account must be a number"),
    })
  ),
});

const emailSchema = z.object({
  Email: z.array(
    z.object({
      value: z.string().regex(emailRegex, "Invalid email address"),
    })
  ),
});

const phoneSchema = z.object({
  Phone: z.array(
    z.object({
      value: z.string().regex(phoneRegex, "Invalid phone number"),
    })
  ),
});
const getSchemaByType = (type: "Account" | "Email" | "Phone") => {
  switch (type) {
    case "Account":
      return accountSchema;
    case "Email":
      return emailSchema;
    case "Phone":
      return phoneSchema;
  }
};

const getDefaultValuesByType = (type: "Account" | "Email" | "Phone") => {
  switch (type) {
    case "Account":
      return { Account: [{ value: "" }] };
    case "Email":
      return { Email: [{ value: "" }] };
    case "Phone":
      return { Phone: [{ value: "" }] };
  }
};

type FormInput = z.infer<typeof accountSchema> &
  z.infer<typeof emailSchema> &
  z.infer<typeof phoneSchema>;

const BrokerAddItems: React.FC<{
  type: "Account" | "Email" | "Phone";
  brokerId: number;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen, brokerId, type }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const ctx = api.useContext();
  const { mutate } = api.brokers.createItem.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "default",
        title: "Success",
        description: `${type} added successfully`,
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
  const form = useForm<FormInput>({
    resolver: zodResolver(getSchemaByType(type)),
    mode: "onSubmit",
    defaultValues: getDefaultValuesByType(type),
  });

  const {
    fields: accFields,
    append: accAppend,
    remove: accRemove,
  } = useFieldArray({
    name: "Account",
    control: form.control,
  });
  const {
    fields: phoneFields,
    append: phoneAppend,
    remove: phoneRemove,
  } = useFieldArray({
    name: "Phone",
    control: form.control,
  });
  const {
    fields: emailFields,
    append: emailAppend,
    remove: emailRemove,
  } = useFieldArray({
    name: "Email",
    control: form.control,
  });
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    setSubmitting(true);
    mutate({
      brokerId,
      type: type,
      values: data[type].map((acc) => acc.value),
    });
  };
  return (
    <Sheet
      onOpenChange={(val) => {
        setOpen(val);
      }}
      open={open}
    >
      <SheetContent size={"sm"} onInteractOutside={() => setOpen(false)}>
        <SheetTitle className="py-6">Add broker</SheetTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {type === "Phone" && (
              <div>
                {phoneFields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`Phone.${index}`}
                    render={() => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Phone Numbers
                        </FormLabel>
                        <FormDescription
                          className={cn(index !== 0 && "sr-only")}
                        >
                          Add phone numbers.
                        </FormDescription>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...form.register(`Phone.${index}.value`)}
                              className="w-[200px]"
                            />
                            {index !== 0 && (
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => phoneRemove(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="mt-1"
                  onClick={() => phoneAppend({ value: "" })}
                >
                  Add Phone
                </Button>
              </div>
            )}
            {type === "Account" && (
              <div>
                {accFields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`Account.${index}`}
                    render={() => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Accounts
                        </FormLabel>
                        <FormDescription
                          className={cn(index !== 0 && "sr-only")}
                        >
                          Add accounts handled by Broker.
                        </FormDescription>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...form.register(`Account.${index}.value`)}
                              className="w-[200px]"
                            />
                            {index !== 0 && (
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => accRemove(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="mt-1"
                  onClick={() => accAppend({ value: "" })}
                >
                  Add Account
                </Button>
              </div>
            )}
            {type === "Email" && (
              <div>
                {emailFields.map((field, index) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`Email.${index}`}
                    render={() => (
                      <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                          Emails
                        </FormLabel>
                        <FormDescription
                          className={cn(index !== 0 && "sr-only")}
                        >
                          Add Broker Emails.
                        </FormDescription>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              {...form.register(`Email.${index}.value`)}
                              className="w-[200px]"
                            />
                            {index !== 0 && (
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => emailRemove(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="mt-1"
                  onClick={() => emailAppend({ value: "" })}
                >
                  Add Email
                </Button>
              </div>
            )}
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

export default BrokerAddItems;
