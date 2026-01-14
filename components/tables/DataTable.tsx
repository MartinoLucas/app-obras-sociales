"use client";

import * as React from "react";
import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

type Align = "left" | "center" | "right";

export type ColumnDef<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;

  headClassName?: string;
  cellClassName?: string;

  align?: Align;
  widthClassName?: string;
  hideOnMobile?: boolean;
};

type DataTableProps<T> = {
  title?: string;
  description?: string;
  caption?: string;

  data: T[];
  columns: ColumnDef<T>[];

  getRowKey?: (row: T, index: number) => string;

  footer?: ReactNode;

  className?: string;
  tableClassName?: string;

  emptyState?: ReactNode;

  /** -------- Header actions -------- */
  headerActions?: ReactNode;

  /** -------- Global search -------- */
  enableSearch?: boolean;
  searchPlaceholder?: string;

  /**
   * Qué texto usar para buscar en cada fila.
   * Default: JSON.stringify(row) (sirve, pero es “ruidoso”).
   */
  searchAccessor?: (row: T) => string;

  /**
   * Modo controlado (si querés manejar search desde afuera).
   */
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
};

function alignClass(align?: Align) {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

export function DataTable<T>({
  title,
  description,
  caption,
  data,
  columns,
  getRowKey,
  footer,
  className,
  tableClassName,
  emptyState,

  headerActions,

  enableSearch = false,
  searchPlaceholder = "Buscar…",
  searchAccessor,
  searchValue,
  onSearchValueChange,
}: DataTableProps<T>) {
  const isControlled = typeof searchValue === "string" && typeof onSearchValueChange === "function";
  const [internalSearch, setInternalSearch] = React.useState("");

  const q = (isControlled ? searchValue : internalSearch).trim().toLowerCase();

  const accessor = React.useCallback(
    (row: T) => {
      if (searchAccessor) return searchAccessor(row);
      // fallback genérico
      try {
        return JSON.stringify(row);
      } catch {
        return String(row);
      }
    },
    [searchAccessor]
  );

  const filteredData = React.useMemo(() => {
    if (!enableSearch || q.length === 0) return data;
    return data.filter((row) => accessor(row).toLowerCase().includes(q));
  }, [enableSearch, q, data, accessor]);

  const visibleCols = columns;

  return (
    <Card className={className ?? "w-full p-6 md:p-8 shadow-lg bg-gray-50"}>
      {(title || description || headerActions || enableSearch) && (
        <CardHeader className="p-0 mb-4 space-y-3">
          {/* Row 1: Title/Description + Actions */}
          {(title || description || headerActions) && (
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                {title ? <CardTitle className="text-2xl md:text-3xl">{title}</CardTitle> : null}
                {description ? (
                  <CardDescription className="text-sm md:text-base">
                    {description}
                  </CardDescription>
                ) : null}
              </div>

              {headerActions ? (
                <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                  {headerActions}
                </div>
              ) : null}
            </div>
          )}

          {/* Row 2: Search */}
          {enableSearch ? (
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="md:max-w-sm w-full">
                <Input
                  value={isControlled ? searchValue : internalSearch}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (isControlled) onSearchValueChange(v);
                    else setInternalSearch(v);
                  }}
                  placeholder={searchPlaceholder}
                />
              </div>

              {/* Mini info */}
              <div className="text-xs text-muted-foreground">
                Mostrando {filteredData.length} de {data.length}
              </div>
            </div>
          ) : null}
        </CardHeader>
      )}

      <CardContent className="p-0">
        <div className="rounded-md border bg-white">
          <Table className={tableClassName}>
            {caption ? <TableCaption className="px-4">{caption}</TableCaption> : null}

            <TableHeader>
              <TableRow className="bg-gray-100/80">
                {visibleCols.map((col) => (
                  <TableHead
                    key={col.id}
                    className={[
                      "font-semibold",
                      alignClass(col.align),
                      col.widthClassName ?? "",
                      col.hideOnMobile ? "hidden md:table-cell" : "",
                      col.headClassName ?? "",
                    ].join(" ")}
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleCols.length} className="py-10 text-center text-sm text-muted-foreground">
                    {emptyState ?? (enableSearch && q ? "No hay resultados para tu búsqueda." : "No hay datos para mostrar.")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, idx) => (
                  <TableRow
                    key={getRowKey ? getRowKey(row, idx) : String(idx)}
                    className="hover:bg-gray-50"
                  >
                    {visibleCols.map((col) => (
                      <TableCell
                        key={col.id}
                        className={[
                          alignClass(col.align),
                          col.hideOnMobile ? "hidden md:table-cell" : "",
                          col.cellClassName ?? "",
                        ].join(" ")}
                      >
                        {col.cell(row, idx)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>

            {footer ? <TableFooter>{footer}</TableFooter> : null}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
