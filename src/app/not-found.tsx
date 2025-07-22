import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="flex flex-col items-center gap-6 p-8 rounded-xl animate-fade-in">
        <span className="text-7xl font-extrabold text-primary select-none">
          404
        </span>
        <h1 className="text-2xl md:text-3xl font-semibold text-center">
          Página no encontrada
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          Lo sentimos, la página que buscas no existe o fue movida.
          <br />
          Si crees que esto es un error, contacta al administrador.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium shadow hover:bg-primary/90 transition"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
