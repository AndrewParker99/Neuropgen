"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export function HomeClient() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteHeader />

      <main style={{ flex: 1 }}>

        {/* ── HERO ── */}
        <section style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "100px 24px 80px",
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

          <div style={{ marginTop: 40, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/explorar" className="btn-green" style={{ fontSize: 16, padding: "14px 32px" }}>
              Educación
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/grupo-apoyo" className="btn-green" style={{ fontSize: 16, padding: "14px 32px", background: "var(--surface)", color: "var(--green)", border: "2px solid var(--green)" }}>
              Grupo de apoyo
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 120px" }}>
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
        <span>© {new Date().getFullYear()} NeuropGen. Todos los derechos reservados.</span>
      </footer>
    </div>
  );
}
