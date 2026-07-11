import Link from "next/link";
import { Logo } from "@/components/Logo";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* Nav — misma barra frosted del home */}
      <header className="site-nav">
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />
          <Link href="/" className="back-link">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Inicio
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 1180, width: "100%", margin: "0 auto", padding: "32px 20px 80px" }}>
        {children}
      </main>

      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 20px",
        textAlign: "center",
        fontSize: 12,
        color: "var(--text-3)",
        lineHeight: 1.9,
      }}>
        Neuropsicólogo Andrés Escalera Páez · Dra. Belen Prieto Corona · Dra. Sulema Rojas · Dra. Julieta Moreno · Dr. Edgar Ricardez
        <br />© {new Date().getFullYear()} Neurapeuta. Todos los derechos reservados.
      </footer>
    </div>
  );
}
