/* eslint-disable @typescript-eslint/no-misused-promises */
import { z } from "zod";
import { Button } from "../UI/Button";
import { CardContent, CardFooter } from "../UI/Card";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Close as SheetClose } from "@radix-ui/react-dialog";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../UI/Sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "../UI/Alert";
import { useState } from "react";
import Spinner from "../UI/Spinner";
import { api } from "pergamos/utils/api";
import { useToast } from "../UI/UseToast";

export const urlRegex =
  /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

const schema = z
  .object({
    website: z.string().regex(urlRegex, "Invalid URL"),
    name: z.string().min(5, "Name must be at least 3 characters long"),
  })
  .required();

export type BankFormData = z.infer<typeof schema>;

const BankCreateSheet: React.FC = () => {
  const [submitting, isSubmitting] = useState(false);
  const { toast } = useToast();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<BankFormData>({
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
    },
    onSuccess: (val) => {
      // toast.custom((t) => <Notify t={t} type="success" />);
      // void router.push(`/dashboard/banks/${val.id}`);
    },
    onError: (error) => {
      // toast.custom((t) => <Notify t={t} type="error" text={error.message} />);
    },
  });
  const onSubmit: SubmitHandler<BankFormData> = (data) => {
    isSubmitting(true);
    toast({ title: "Creating Bank", description: "Please wait" });
    // console.log(data);
  };
  return (
    <Sheet
      onOpenChange={(val) => {
        !val && reset();
      }}
    >
      <Button variant={"default"} asChild className="h-8">
        <SheetTrigger>Add New</SheetTrigger>
      </Button>
      <SheetContent size={"sm"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle className="p-6">Add bank</SheetTitle>

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
                {errors.name && (
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
                {errors.website && (
                  <Alert variant={"destructive"} className="mt-1">
                    {errors.website.message}
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-between space-x-2">
              <Button variant="outline" asChild>
                <SheetClose>Close </SheetClose>
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Spinner />}
                <div className="flex items-center gap-2">
                  Submitting
                  <Spinner />
                </div>
              </Button>
            </CardFooter>
          </SheetHeader>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default BankCreateSheet;
