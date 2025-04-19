import { User } from "@prisma/client";
import { Link } from "@/i18n/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";

interface Props {
  users: User[];
}

export function UsersList({ users }: Props) {
  const t = useTranslations("admin.usersList");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <Link href={`/admin/create-user`}>
          <Button>{t("createUser") || "Create User"}</Button>
        </Link>
      </div>

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
                  href={`/admin/customer-details/${user.id}`}
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
