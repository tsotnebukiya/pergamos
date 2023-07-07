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
  view: boolean;
  id?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  filters = [],
  actions,
  view,
  id,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  return (
    <div className="items-top flex justify-between">
      <div className=" flex justify-start gap-2">
        <Input
          placeholder="Filter items..."
          value={
            (table
              .getColumn(`${id ? "id" : "name"}`)
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) => {
            table
              .getColumn(id ? "id" : "name")
              ?.setFilterValue(event.target.value);
          }}
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
      <div className="1250:flex-row flex flex-col gap-2 space-x-2">
        {actions}

        {view && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
