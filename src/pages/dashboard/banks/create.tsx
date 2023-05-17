// /* eslint-disable @typescript-eslint/no-misused-promises */
// import { ReactElement, useState } from "react";
// import type { NextPageWithLayout } from "pergamos/utils/types";
// import DashboardLayout from "pergamos/components/layouts/DashboardLayout";
// import BreadCrumbs from "pergamos/components/Breadcrumbs";
// import Grid from "pergamos/components/UI/Grid";
// import Input from "pergamos/components/UI/Input";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import CardHeader from "pergamos/components/UI/CardHeader";
// import Link from "next/link";
// import ButtonStyle from "pergamos/components/UI/ButtonStyle";
// import ImageInput from "pergamos/components/UI/ImageInput";
// import { toast } from "react-hot-toast";
// import Notify from "pergamos/components/overlays/Toast";
// import { api } from "pergamos/utils/api";
// import { useRouter } from "next/router";

// export const urlRegex =
//   /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;

// const schema = z
//   .object({
//     website: z.string().regex(urlRegex, "Invalid URL"),
//     name: z.string().min(5, "Name must be at least 5 characters long"),
//     files: z.unknown().refine((value) => value instanceof FileList, {
//       message: "Please upload a file",
//     }),
//   })
//   .required();

// export type BankFormData = z.infer<typeof schema>;

// const CreateBankPage: NextPageWithLayout = () => {
//   const [creating, setCreating] = useState(false);
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm<BankFormData>({
//     resolver: zodResolver(schema),
//   });
//   const { mutate } = api.banks.create.useMutation({
//     onSettled: () => {
//       setCreating(false);
//     },
//     onSuccess: (val) => {
//       toast.custom((t) => <Notify t={t} type="success" />);
//       void router.push(`/dashboard/banks/${val.id}`);
//     },
//     onError: (error) => {
//       toast.custom((t) => <Notify t={t} type="error" text={error.message} />);
//     },
//   });
//   const onSubmit: SubmitHandler<BankFormData> = (data) => {
//     setCreating(true);
//     mutate(data);
//   };
//   return (
//     <>
//       <BreadCrumbs
//         pages={[
//           { name: "Banks", href: "/dashboard/banks" },
//           { name: "New", href: `/dashboard/banks/create` },
//         ]}
//       />
//       <Grid>
//         <div className=" col-span-3 overflow-hidden rounded-xl border  border-gray-200 shadow-lg dark:border-white/10">
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <CardHeader heading="Bank Details">
//               <Link href={`/dashboard/banks/`}>
//                 <ButtonStyle text="Cancel" type="secondary" />
//               </Link>
//               <button type="submit" disabled={creating}>
//                 <ButtonStyle
//                   text={creating ? "Saving..." : "Save"}
//                   spinner={creating}
//                 />
//               </button>
//             </CardHeader>
//             <div className="mb-4 grid grid-cols-1 gap-x-6 gap-y-8 px-6 py-4 sm:grid-cols-6">
//               <div className="sm:col-span-5">
//                 <Input
//                   label="website"
//                   required
//                   register={register}
//                   placeholder="https://website.com"
//                   type="text"
//                   errors={errors}
//                 />
//               </div>
//               <div className="sm:col-span-5">
//                 <Input
//                   label="name"
//                   required
//                   register={register}
//                   placeholder="Bank XYZ"
//                   type="text"
//                   errors={errors}
//                 />
//               </div>
//               <div className="sm:col-span-5">
//                 <ImageInput
//                   required
//                   label="files"
//                   setValue={setValue}
//                   register={register}
//                   errors={errors}
//                 />
//               </div>
//             </div>
//           </form>
//         </div>
//       </Grid>
//     </>
//   );
// };

// CreateBankPage.getLayout = function getLayout(page: ReactElement) {
//   return <DashboardLayout>{page}</DashboardLayout>;
// };

// export default CreateBankPage;
