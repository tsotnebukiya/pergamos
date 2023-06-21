import { Button } from "../UI/Button";
import { FormControl, FormItem, FormLabel, FormMessage } from "../UI/Form";
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
import { ScrollArea } from "../UI/ScrollArea";
import React from "react";

export const ComboBox: React.FC<{
  fieldValue: string;
  onSelect: (value: string) => void;
  array?: { value: string; label?: string | JSX.Element }[];
  name: string;
}> = ({ fieldValue, array, onSelect, name }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open}>
      <PopoverTrigger asChild onClick={() => setOpen(true)}>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !fieldValue && "text-muted-foreground"
            )}
          >
            {!array
              ? `Select ${name}`
              : fieldValue
              ? array.find((el) => el.value === fieldValue)?.label
              : `Select ${name}`}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent onInteractOutside={() => setOpen(false)}>
        <Command>
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandEmpty>No {name} found.</CommandEmpty>

          <CommandGroup>
            <ScrollArea>
              {array &&
                array.map((el) => (
                  <CommandItem
                    value={el.value}
                    key={el.value}
                    onSelect={(value) => {
                      onSelect(value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        el.value === fieldValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {el.label}
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
