import Link from "next/link";
import { Logo } from "@/components/Logo";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7fbf8]">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <header className="flex flex-wrap items-center justify-between gap-4 py-6">
          <Logo />
          <Link
            href="/"
            className="rounded-full border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-extrabold text-clinical-600 hover:bg-stone-50"
          >
            ← Volver al inicio
          </Link>
        </header>
        <main className="pb-16">{children}</main>
        <footer className="rounded-3xl bg-clinical-700 px-4 py-6 text-center text-sm text-white/85">
          Creación por parte de Neuropsicólogo Andrés Escalera Páez, Dra. Belen Prieto Corona, Dra. Sulema Rojas, Dra.
          Julieta Moreno, Dr. Edgar Ricardez.
          <br />© {new Date().getFullYear()} Neurapeuta. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  );
}
