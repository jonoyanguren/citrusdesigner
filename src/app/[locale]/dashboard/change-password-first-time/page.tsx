"use client";
import { makeApiRequest } from "@/lib/api";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordFirstTime() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await makeApiRequest("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 border bg-white p-8 rounded-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold">Cambiar contraseña</h2>
          <p className="text-foreground/60">
            Es la primera vez que entras, así que por seguridad, cambia tu
            contraseña
          </p>
          <Input
            id="password"
            name="password"
            type="password"
            label="Nueva contraseña"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirmar contraseña"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button type="submit">Cambiar contraseña</Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
