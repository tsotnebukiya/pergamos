import type { Table } from "@tanstack/react-table";
import { type LucideIcon, X } from "lucide-react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";

export interface FilterOption {
  columnName: string;
  title: string;
  options: { value: string; label?: string; icon?: LucideIcon }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filters?: FilterOption[];
  actions?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  filters = [],
  actions,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col justify-start gap-2 big:flex-row big:items-center">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex justify-between gap-2">
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnName);
            if (column) {
              return (
                <DataTableFacetedFilter
                  key={filter.columnName}
                  column={column}
                  title={filter.title}
                  options={filter.options}
                />
              );
            }
            return null;
          })}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <DataTableViewOptions table={table} />
        {actions}
      </div>
    </div>
  );
}
