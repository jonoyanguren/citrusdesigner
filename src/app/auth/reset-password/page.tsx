"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError("Token no válido");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al restablecer la contraseña");
      }

      router.push("/auth/login?reset=true");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al restablecer la contraseña"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Restablecer contraseña</h2>
          <p className="mt-2 text-foreground/60">Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              id="password"
              type="password"
              label="Nueva contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirmar contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button type="submit" fullWidth isLoading={isLoading}>
            {isLoading ? "Restableciendo..." : "Restablecer contraseña"}
          </Button>

          <p className="text-center text-sm">
            <Link href="/auth/login" className="hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
