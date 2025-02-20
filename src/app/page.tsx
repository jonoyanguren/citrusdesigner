"use client";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Bienvenido a Citrus Designer
        </h1>
        <p className="text-xl text-center mb-8">
          La plataforma perfecta para dar vida a tus diseños
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            onClick={() => router.push("/how-it-works")}
          >
            Cómo funciona
          </Button>
          <Button variant="secondary" onClick={() => router.push("/contact")}>
            Contáctanos
          </Button>
        </div>
      </main>
    </div>
  );
}
