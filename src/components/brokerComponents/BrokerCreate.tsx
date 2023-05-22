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
import { Popover, PopoverContent, PopoverTrigger } from "../UI/Popover";
import { cn } from "pergamos/utils/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../UI/Command";
import { marketsArr } from "../UI/Market";
import { ScrollArea } from "../UI/ScrollArea";
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  market: z.string(),
  assignedTeam: z.number(),
  account: z.array(z.string()),
});

const BrokerCreate: React.FC<{
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
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    setSubmitting(true);
    // mutate(data);
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Broker Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? marketsArr.find(
                                (market) =>
                                  market.value.toLowerCase() === field.value
                              )?.label
                            : "Select market"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent>
                      <Command>
                        <CommandInput placeholder="Search framework..." />
                        <CommandEmpty>No market found.</CommandEmpty>

                        <CommandGroup>
                          <ScrollArea className="h-[200px]">
                            {marketsArr.map((market) => (
                              <CommandItem
                                value={market.value}
                                key={market.value}
                                onSelect={(value) => {
                                  form.setValue("market", value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    market.value.toLowerCase() === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {market.label}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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

export default BrokerCreate;
