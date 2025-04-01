import Button from "@/components/Button";
import { useTranslations } from "next-intl";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";

interface Invoice {
  id: string;
  number: string;
  amount_paid: number;
  status: string;
  created: number;
  invoice_pdf: string | null;
  currency: string;
}

interface Props {
  invoices: Invoice[];
  isLoading?: boolean;
}

export function InvoicesTab({ invoices, isLoading }: Props) {
  const t = useTranslations("dashboard.invoices");

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadgeClass = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "paid":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "open":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "void":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!invoices?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          {t("empty.title")}
        </h3>
        <p className="mt-2 text-sm text-gray-500">{t("empty.description")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("title")}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{t("table.number")}</TableHeaderCell>
            <TableHeaderCell>{t("table.date")}</TableHeaderCell>
            <TableHeaderCell>{t("table.amount")}</TableHeaderCell>
            <TableHeaderCell>{t("table.status")}</TableHeaderCell>
            <TableHeaderCell>{t("table.actions")}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>{formatDate(invoice.created)}</TableCell>
              <TableCell>
                {formatAmount(invoice.amount_paid, invoice.currency)}
              </TableCell>
              <TableCell>
                <span className={getStatusBadgeClass(invoice.status)}>
                  {t(`status.${invoice.status}`)}
                </span>
              </TableCell>
              <TableCell>
                {invoice.invoice_pdf && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(invoice.invoice_pdf!, "_blank")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {t("actions.download")}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
