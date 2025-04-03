import { User } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";
import { useTranslations } from "next-intl";

interface Props {
  users: User[];
}

export function UsersList({ users }: Props) {
  const { locale } = useParams();
  const t = useTranslations("admin.usersList");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t("title")}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{t("table.name")}</TableHeaderCell>
            <TableHeaderCell>{t("table.email")}</TableHeaderCell>
            <TableHeaderCell>{t("table.role")}</TableHeaderCell>
            <TableHeaderCell>{t("table.actions")}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Link
                  href={`/${locale}/admin/customer-details/${user.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {t("table.viewDetails")}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
