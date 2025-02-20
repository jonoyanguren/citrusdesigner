export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <main className="max-w-4xl w-full mt-16">
        <h1 className="text-3xl font-bold mb-12 text-center">
          ¿Cómo funciona Citrus Designer?
        </h1>

        <div className="grid gap-8">
          <div className="p-6 border border-foreground/20 rounded-lg">
            <h2 className="text-xl font-bold mb-4">1. Diseña</h2>
            <p className="text-foreground/80">
              Utiliza nuestras herramientas intuitivas para crear diseños únicos
              y profesionales.
            </p>
          </div>

          <div className="p-6 border border-foreground/20 rounded-lg">
            <h2 className="text-xl font-bold mb-4">2. Personaliza</h2>
            <p className="text-foreground/80">
              Ajusta colores, fuentes y elementos hasta conseguir el resultado
              perfecto.
            </p>
          </div>

          <div className="p-6 border border-foreground/20 rounded-lg">
            <h2 className="text-xl font-bold mb-4">3. Exporta</h2>
            <p className="text-foreground/80">
              Descarga tus diseños en múltiples formatos listos para usar.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
          >
            ¿Tienes dudas? Contáctanos
          </a>
        </div>
      </main>
    </div>
  );
}
