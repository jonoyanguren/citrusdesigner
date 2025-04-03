import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
}

interface UsersSelectProps {
  onSelect: (userId: string) => void;
  selectedUserId?: string;
  label?: string;
  className?: string;
}

export function UsersSelect({
  onSelect,
  selectedUserId = "",
  label = "Usuario",
  className = "",
}: UsersSelectProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/users/active");
        const data = await response.json();
        setUsers([{ id: "", name: "Todos los usuarios" }, ...data]);
        console.log(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className="w-full px-3 py-2 border rounded-lg"
        value={selectedUserId}
        onChange={(e) => onSelect(e.target.value)}
        disabled={isLoading}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
}
