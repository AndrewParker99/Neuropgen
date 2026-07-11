"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { useCms } from "@/components/CmsProvider";

const cardLinks: Record<string, string> = {
  enfermedades:  "/enfermedades",
  psicoeducacion:"/psicoeducacion",
  recursos:      "/recursos",
  "grupo-apoyo": "/grupo-apoyo",
};

export function HomeClient() {
  const { site } = useCms();

  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader />

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px" }}>

        {/* ── Hero ── */}
        <section style={{ padding: "80px 0 64px", display: "grid", gap: 64, gridTemplateColumns: "1fr 1fr", alignItems: "center" }}>

          <div>
            <span className="badge-green">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
              Psicoeducación genética y neuropsicológica
            </span>

            <h1 style={{
              marginTop: 24,
              fontSize: "clamp(42px, 5.5vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              color: "var(--text-1)",
            }}>
              Información que<br />
              <span style={{ color: "var(--green)" }}>acompaña</span> a tu familia.
            </h1>

            <p style={{ marginTop: 20, fontSize: 18, lineHeight: 1.65, color: "var(--text-2)", maxWidth: "42ch" }}>
              NeuropGen acerca información confiable, clara y humana sobre genética y neuropsicología a pacientes, familias y profesionales.
            </p>

            <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/enfermedades" className="btn-green">
                Explorar biblioteca
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/grupo-apoyo" style={{ fontSize: 15, fontWeight: 500, color: "var(--green)", textDecoration: "none", letterSpacing: "-0.01em" }}>
                Grupo de apoyo →
              </Link>
            </div>

            <blockquote className="quote-block" style={{ marginTop: 40 }}>
              Cuando llega un diagnóstico, también puede empezar un camino acompañado, con palabras simples y pasos posibles.
            </blockquote>
          </div>

          {/* ── Cards de módulos ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {site.sections.map((section) => (
              <article
                key={section.id}
                className="apple-card"
                style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 220 }}
              >
                <div>
                  <span style={{
                    display: "grid", placeItems: "center",
                    width: 48, height: 48,
                    borderRadius: 14,
                    background: "var(--green-light)",
                    fontSize: 22,
                    marginBottom: 14,
                  }}>
                    {section.icon}
                  </span>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-1)", lineHeight: 1.25 }}>
                    {section.title}
                  </h3>
                  <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.55, color: "var(--text-2)" }}>
                    {section.summary}
                  </p>
                </div>
                <Link
                  href={cardLinks[section.id] || "/"}
                  style={{ marginTop: 18, fontSize: 13, fontWeight: 600, color: "var(--green)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  Acceder
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 20px",
        textAlign: "center",
        fontSize: 12,
        color: "var(--text-3)",
        lineHeight: 1.8,
      }}>
        Neuropsicólogo Andrés Escalera Páez · Dra. Belen Prieto Corona · Dra. Sulema Rojas · Dra. Julieta Moreno · Dr. Edgar Ricardez
        <br />© {new Date().getFullYear()} Neurapeuta. Todos los derechos reservados.
      </footer>
    </div>
  );
}
