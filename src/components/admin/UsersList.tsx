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

interface Props {
  users: User[];
}

export function UsersList({ users }: Props) {
  const { locale } = useParams();
  console.log("LOCALE", locale);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Usuarios</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Nombre</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Rol</TableHeaderCell>
            <TableHeaderCell>Acciones</TableHeaderCell>
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
                  Ver detalles
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
