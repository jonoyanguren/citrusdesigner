"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

interface Project {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const userResponse = await fetch("/api/user");
        if (!userResponse.ok) {
          throw new Error("No autorizado");
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Obtener proyectos del usuario
        const projectsResponse = await fetch("/api/projects");
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
        }
      } catch (err) {
        setError("Por favor inicia sesión para acceder");
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/auth/login" className="text-sm hover:underline">
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-8 pt-20">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-foreground/60">Bienvenido, {user?.name}</p>
          </div>
          <Button onClick={() => router.push("/projects/new")}>
            Nuevo Proyecto
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-foreground/5 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Proyectos Totales</h3>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>
          <div className="bg-foreground/5 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Último Proyecto</h3>
            <p className="text-lg">{projects[0]?.title || "Sin proyectos"}</p>
          </div>
          <div className="bg-foreground/5 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Estado de la Cuenta</h3>
            <p className="text-lg">Activa</p>
          </div>
        </div>

        {/* Projects List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Tus Proyectos</h2>
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-foreground/5 rounded-xl">
              <p className="text-foreground/60 mb-4">
                No tienes proyectos creados aún
              </p>
              <Button
                onClick={() => router.push("/projects/new")}
                variant="primary"
              >
                Crear tu primer proyecto
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-foreground/5 rounded-xl overflow-hidden"
                >
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-foreground/60 mb-4">
                        {project.description}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-foreground/60">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/projects/${project.id}`)}
                        className="text-sm"
                      >
                        Ver detalles →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
