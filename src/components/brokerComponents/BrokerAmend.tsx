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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../UI/Form";
import { useRouter } from "next/router";
import { ComboBox } from "../UI/ComboBox";
import { marketsArr } from "../UI/Market";

const formSchema = z
  .object({
    market: z.string().or(z.literal("")),
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long")
      .or(z.literal("")),
    assignedTeam: z.string().or(z.literal("")),
    _error: z.string().optional(),
  })
  .refine((data) => Object.values(data).some((val) => val !== ""), {
    message: "At least one field must not be an empty string",
    path: ["_error"],
  });

const BrokerAmend: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const { brokerId } = useRouter().query;
  const { toast } = useToast();
  const ctx = api.useContext();
  const [submitting, setSubmitting] = useState(false);
  const { data: teamsData } = api.teams.getAll.useQuery();
  const teamsArr = teamsData?.map((el) => ({
    value: el.id.toString(),
    label: el.name,
  }));
  const { mutate } = api.brokers.amend.useMutation({
    onSuccess: () => {
      setSubmitting(false);
      setOpen(false);
      toast({
        variant: "default",
        title: "Success",
        description: "Bank amended successfully",
      });
      void ctx.brokers.getOne.invalidate({ id: Number(brokerId) });
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
      market: "",
      assignedTeam: "",
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    setSubmitting(true);
    mutate({
      brokerId: Number(brokerId),
      details: { ...data, assignedTeam: Number(data.assignedTeam) },
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
        <SheetTitle className="py-6">Edit broker</SheetTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker Name</FormLabel>
                  <FormDescription>Edit the name</FormDescription>
                  <FormControl>
                    <Input placeholder="Name" {...field} required={false} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Market</FormLabel>
                  <FormDescription>
                    Choose market handled by Broker
                  </FormDescription>
                  <ComboBox
                    fieldValue={field.value}
                    array={marketsArr}
                    name="market"
                    onSelect={(value) => form.setValue("market", value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignedTeam"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assigned Team</FormLabel>
                  <FormDescription>
                    Choose Citi Team interacting with Broker
                  </FormDescription>
                  <ComboBox
                    fieldValue={field.value}
                    array={teamsArr}
                    name="team"
                    onSelect={(value) => form.setValue("assignedTeam", value)}
                  />
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

export default BrokerAmend;
