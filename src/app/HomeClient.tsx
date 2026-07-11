"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { useCms } from "@/components/CmsProvider";

const cardLinks: Record<string, string> = {
  enfermedades:   "/enfermedades",
  psicoeducacion: "/psicoeducacion",
  recursos:       "/recursos",
  "grupo-apoyo":  "/grupo-apoyo",
};

export function HomeClient() {
  const { site } = useCms();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />

      <main style={{ flex: 1 }}>

        {/* ── HERO centrado ── */}
        <section style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "96px 24px 80px",
          textAlign: "center",
        }}>
          <span className="badge-green" style={{ marginBottom: 28, display: "inline-flex" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
            Psicoeducación genética y neuropsicológica
          </span>

          <h1 style={{
            fontSize: "clamp(48px, 7vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            color: "var(--text-1)",
            margin: 0,
          }}>
            Información que{" "}
            <span style={{ color: "var(--green)" }}>acompaña</span>
            <br />a tu familia.
          </h1>

          <p style={{
            marginTop: 24,
            fontSize: 19,
            lineHeight: 1.65,
            color: "var(--text-2)",
            maxWidth: "52ch",
            margin: "24px auto 0",
          }}>
            NeuropGen acerca información confiable, clara y humana sobre genética y
            neuropsicología a pacientes, familias y profesionales de salud.
          </p>

          <div style={{ marginTop: 36, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/enfermedades" className="btn-green" style={{ fontSize: 16, padding: "13px 28px" }}>
              Explorar biblioteca
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/grupo-apoyo" style={{ fontSize: 16, fontWeight: 500, color: "var(--green)", textDecoration: "none" }}>
              Grupo de apoyo →
            </Link>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 72px" }}>
          <figure style={{
            margin: 0,
            padding: "28px 36px",
            background: "var(--surface)",
            borderRadius: 18,
            boxShadow: "var(--shadow-card)",
            borderLeft: "4px solid var(--green)",
            textAlign: "left",
          }}>
            <blockquote style={{
              margin: 0,
              fontSize: 17,
              lineHeight: 1.7,
              color: "var(--text-2)",
              fontStyle: "italic",
              letterSpacing: "-0.01em",
            }}>
              "Cuando llega un diagnóstico, también puede empezar un camino acompañado,
              con palabras simples y pasos posibles."
            </blockquote>
          </figure>
        </div>

        {/* ── CARDS de módulos ── */}
        <section
          aria-label="Módulos principales"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 24px 100px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {site.sections.map((section) => (
            <article
              key={section.id}
              className="apple-card"
              style={{
                padding: "32px 28px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {/* Icono */}
              <span style={{
                display: "grid",
                placeItems: "center",
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "var(--green-light)",
                fontSize: 26,
                marginBottom: 20,
                flexShrink: 0,
              }}>
                {section.icon}
              </span>

              {/* Contenido */}
              <h3 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "var(--text-1)",
                lineHeight: 1.2,
              }}>
                {section.title}
              </h3>
              <p style={{
                margin: "10px 0 0",
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--text-2)",
                flexGrow: 1,
              }}>
                {section.summary}
              </p>

              {/* CTA */}
              <Link
                href={cardLinks[section.id] || "/"}
                style={{
                  marginTop: 24,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--green)",
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                Acceder
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </article>
          ))}
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 20px",
        textAlign: "center",
        fontSize: 12,
        color: "var(--text-3)",
        lineHeight: 1.9,
      }}>
        Neuropsicólogo Andrés Escalera Páez · Dra. Belen Prieto Corona · Dra. Sulema Rojas
        · Dra. Julieta Moreno · Dr. Edgar Ricardez
        <br />
        <span>© {new Date().getFullYear()} Neurapeuta. Todos los derechos reservados.</span>
      </footer>
    </div>
  );
}
