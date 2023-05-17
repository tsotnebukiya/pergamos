/* eslint-disable @typescript-eslint/no-misused-promises */
import { ReactElement, useState } from "react";
import type { NextPageWithLayout } from "pergamos/utils/types";
import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
import BreadCrumbs from "pergamos/components/navbar/Breadcrumbs";
import Grid from "pergamos/components/UI/Grid";
import Input from "pergamos/components/UI/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CardHeader from "pergamos/components/UI/CardHeader";
import Link from "next/link";
import ButtonStyle from "pergamos/components/UI/ButtonStyle";
import ImageInput from "pergamos/components/UI/ImageInput";
import { toast } from "react-hot-toast";
import Notify from "pergamos/components/overlays/Toast";
import { api } from "pergamos/utils/api";
import { useRouter } from "next/router";
import PageHeader from "pergamos/components/UI/PageHeader";
import type { GetServerSideProps } from "next";
import { createHelpers } from "pergamos/utils/helpers";

export const urlRegex =
  /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

const schema = z.object({
  website: z.string().regex(urlRegex, "Invalid URL").or(z.literal("")),
  name: z
    .string()
    .min(5, "Name must be at least 5 characters long")
    .or(z.literal("")),
  files: z.custom<FileList>(),
});

export type BankFormData = z.infer<typeof schema>;

const EditBankPage: NextPageWithLayout = () => {
  const router = useRouter();
  const query = router.query.bankId as string;
  const { data } = api.banks.getOne.useQuery({ id: Number(query) });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BankFormData>({
    resolver: zodResolver(schema),
  });
  const { mutate } = api.banks.amend.useMutation({
    onSuccess: async () => {
      await router.push(`/dashboard/banks/${query}`);
      toast.custom((t) => <Notify t={t} type="success" />);
    },
    onError: (error) => {
      toast.custom((t) => <Notify t={t} type="error" text={error.message} />);
    },
  });
  const [saving, setSaving] = useState(false);
  const onSubmit: SubmitHandler<BankFormData> = ({ name, website }) => {
    setSaving(true);
    const newName = name !== "" ? name : undefined;
    const newWebsite = website !== "" ? website : undefined;
    if (!newName && !newWebsite) {
      toast.custom((t) => (
        <Notify t={t} type="error" text="Update at least one field" />
      ));
    } else {
      mutate({
        bankId: Number(query),
        details: { name: newName, website: newWebsite },
      });
    }
  };
  if (!data) return null;
  return (
    <>
      <BreadCrumbs
        pages={[
          { name: "Banks", href: "/dashboard/banks" },
          { name: data.name, href: `/dashboard/banks/${data.id}` },
          { name: "Edit", href: `/dashboard/banks/${data.id}/edit` },
        ]}
      />
      <PageHeader
        heading={data.name}
        image={data.image || "https://tailwindui.com/img/logos/48x48/tuple.svg"}
      />
      <Grid>
        <div className=" col-span-3 overflow-hidden rounded-xl border  border-gray-200 shadow-lg dark:border-white/10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader heading="Bank Details">
              <Link href={`/dashboard/banks/${query}`}>
                <ButtonStyle text="Cancel" type="secondary" />
              </Link>
              <button type="submit">
                <ButtonStyle
                  text={saving ? "Saving..." : "Save"}
                  spinner={saving}
                />
              </button>
            </CardHeader>
            <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-8 px-6 py-4 sm:grid-cols-6">
              <div className="sm:col-span-5">
                <Input
                  label="website"
                  required
                  register={register}
                  placeholder="https://website.com"
                  type="text"
                  errors={errors}
                />
              </div>
              <div className="sm:col-span-5">
                <Input
                  label="name"
                  required
                  register={register}
                  placeholder="Bank XYZ"
                  type="text"
                  errors={errors}
                />
              </div>
              <div className="sm:col-span-5">
                <ImageInput
                  required
                  label="files"
                  setValue={setValue}
                  register={register}
                  errors={errors}
                />
              </div>
            </div>
          </form>
        </div>
      </Grid>
    </>
  );
};

EditBankPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default EditBankPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const helper = await createHelpers(context);
  const id = context.params?.bankId;
  if (typeof id !== "string") throw new Error("Invalid bank id");
  try {
    await helper.banks.getOne.prefetch({ id: Number(id) });
  } catch (e) {
    return { redirect: { destination: "/404", permanent: false } };
  }

  return {
    props: {
      trpcState: helper.dehydrate(),
    },
  };
};
