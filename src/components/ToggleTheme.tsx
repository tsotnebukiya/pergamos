import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { useTheme } from "next-themes";

// const LightIcon: React.FC<{ className: string }> = ({ className }) => {
//   return (
//     <svg aria-hidden="true" viewBox="0 0 16 16" className={className}>
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M7 1a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0V1Zm4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm2.657-5.657a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414Zm-1.415 11.313-.707-.707a1 1 0 0 1 1.415-1.415l.707.708a1 1 0 0 1-1.415 1.414ZM16 7.999a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2h1a1 1 0 0 0 1-1ZM7 14a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1Zm-2.536-2.464a1 1 0 0 0-1.414 0l-.707.707a1 1 0 0 0 1.414 1.414l.707-.707a1 1 0 0 0 0-1.414Zm0-8.486A1 1 0 0 1 3.05 4.464l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707ZM3 8a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h1a1 1 0 0 0 1-1Z"
//       />
//     </svg>
//   );
// };

// const DarkIcon: React.FC<{ className: string }> = ({ className }) => {
//   return (
//     <svg aria-hidden="true" viewBox="0 0 16 16" className={className}>
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M7.23 3.333C7.757 2.905 7.68 2 7 2a6 6 0 1 0 0 12c.68 0 .758-.905.23-1.332A5.989 5.989 0 0 1 5 8c0-1.885.87-3.568 2.23-4.668ZM12 5a1 1 0 0 1 1 1 1 1 0 0 0 1 1 1 1 0 1 1 0 2 1 1 0 0 0-1 1 1 1 0 1 1-2 0 1 1 0 0 0-1-1 1 1 0 1 1 0-2 1 1 0 0 0 1-1 1 1 0 0 1 1-1Z"
//       />
//     </svg>
//   );
// };

// const themes = [
//   { name: "Light", value: "light", icon: LightIcon },
//   { name: "Dark", value: "dark", icon: DarkIcon },
// ];

// const ToggleTheme: React.FC = () => {
//   const { theme, setTheme } = useTheme();
//   return (
//     <Listbox
//       as="div"
//       value={theme}
//       onChange={setTheme}
//       className={"relative z-10"}
//     >
//       <Listbox.Label className="sr-only">Theme</Listbox.Label>
//       <Listbox.Button
//         className="flex h-7 w-7 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1
//          ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5"
//         aria-label={theme}
//       >
//         <LightIcon className="block h-5 w-5 fill-indigo-400 dark:hidden" />
//         <DarkIcon className="hidden h-5 w-5 fill-indigo-400 dark:block" />
//       </Listbox.Button>
//       <Listbox.Options className="absolute left-1/2 top-full mt-3 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/5">
//         {themes.map((themeEl) => (
//           <Listbox.Option
//             key={themeEl.value}
//             value={themeEl.value}
//             className={({ active, selected }) => {
//               return clsx(
//                 "flex cursor-pointer select-none items-center rounded-[0.625rem] p-1",
//                 {
//                   "text-indigo-500": selected,
//                   "text-slate-900 dark:text-white": active && !selected,
//                   "text-slate-700 dark:text-slate-400": !active && !selected,
//                   "bg-slate-100 dark:bg-slate-900/40": active,
//                 }
//               );
//             }}
//           >
//             {({ selected }) => (
//               <>
//                 <div className="rounded-md bg-white p-1 shadow ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5">
//                   <themeEl.icon
//                     className={clsx(
//                       "h-4 w-4",
//                       selected
//                         ? "fill-indigo-400 dark:fill-indigo-400"
//                         : "fill-slate-400"
//                     )}
//                   />
//                 </div>
//                 <div className="ml-3">{themeEl.name}</div>
//               </>
//             )}
//           </Listbox.Option>
//         ))}
//       </Listbox.Options>
//     </Listbox>
//   );
// };

// export default ToggleTheme;

import { Button } from "./newUI/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./newUI/DropDownMenu";

import { Icons } from "./newUI/Icons";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Icons.sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Icons.moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
