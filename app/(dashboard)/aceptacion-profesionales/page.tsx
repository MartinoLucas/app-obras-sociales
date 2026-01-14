"use client";

import * as React from "react";
import { DataTable, type ColumnDef } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

type InvoiceRow = {
  invoice: string;
  paymentStatus: "Paid" | "Pending" | "Unpaid";
  totalAmount: string;
  paymentMethod: string;
};

const invoices: InvoiceRow[] = [
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  // ...
];

const columns: ColumnDef<InvoiceRow>[] = [
  { id: "invoice", header: "Invoice", widthClassName: "w-[140px]", cell: (r) => <span className="font-medium">{r.invoice}</span> },
  { id: "status", header: "Status", cell: (r) => r.paymentStatus },
  { id: "method", header: "Method", cell: (r) => r.paymentMethod, hideOnMobile: true },
  { id: "amount", header: <span className="inline-block w-full text-right">Amount</span>, align: "right", cell: (r) => r.totalAmount },
];

export default function TableDemo() {
  return (
    <DataTable
      title="Recent invoices"
      description="A list of your recent invoices."
      caption="A list of your recent invoices."
      data={invoices}
      columns={columns}
      getRowKey={(r) => r.invoice}
      enableSearch
      searchPlaceholder="Buscar por invoice, status, método..."
      searchAccessor={(row) =>
        `${row.invoice} ${row.paymentStatus} ${row.paymentMethod} ${row.totalAmount}`
      }
      headerActions={
        <>
          <Button variant="outline" onClick={() => toast.success("Exportando...")}>
            Exportar
          </Button>
          <Button onClick={() => toast.success("Creando nueva factura...")}>Nueva factura</Button>
        </>
      }
      footer={
        <TableRow>
          <TableCell colSpan={3} className="font-medium">Total</TableCell>
          <TableCell className="text-right font-semibold">$2,500.00</TableCell>
        </TableRow>
      }
    />
  );
}
