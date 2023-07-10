import { MouseEvent, useState } from "react";
import { Input } from "../UI/Input";
import CommandMenu from "./CommandMenu";
import { Button } from "../UI/Button";
import { cn } from "pergamos/utils/utils";

export function Search() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <CommandMenu open={open} setOpen={setOpen} />
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">Search...</span>
        {/* <span className="inline-flex lg:hidden">Search...</span> */}
        {/* <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd> */}
      </Button>
    </div>
  );
}
