import Link from "next/link";
import { PageShell } from "@/components/PageShell";

const CATEGORIAS = [
  {
    slug: "genetico",
    icon: "🧬",
    title: "Genético",
    desc: "Síndromes y enfermedades genéticas explicadas con palabras claras para familias.",
    color: "#e6f4ed",
  },
  {
    slug: "neuropsicologico",
    icon: "🧠",
    title: "Neuropsicológico",
    desc: "Perfiles cognitivos, funciones ejecutivas, memoria, atención y lenguaje.",
    color: "#ede9fe",
  },
  {
    slug: "conductual",
    icon: "💚",
    title: "Conductual",
    desc: "Estrategias para manejo de conducta, emociones y regulación en casa.",
    color: "#fef9c3",
  },
  {
    slug: "recursos",
    icon: "📄",
    title: "Recursos Descargables",
    desc: "Guías en PDF, infografías y checklists para llevar contigo.",
    color: "#fce7f3",
  },
];

export default function ExplorarPage() {
  return (
    <PageShell>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Cabecera */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "var(--green)", marginBottom: 16,
          }}>
            Biblioteca NeuropGen
          </span>
          <h1 style={{
            margin: "0 0 16px",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--text-1)",
          }}>
            ¿Qué quieres aprender hoy?
          </h1>
          <p style={{ margin: 0, fontSize: 17, color: "var(--text-2)", lineHeight: 1.6 }}>
            Elige una categoría para comenzar. Puedes avanzar a tu ritmo.
          </p>
        </div>

        {/* Grid de categorías */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 20,
        }}>
          {CATEGORIAS.map((cat) => (
            <Link key={cat.slug} href={`/${cat.slug}`} style={{ textDecoration: "none" }}>
              <div className="apple-card" style={{
                padding: "32px 28px",
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                cursor: "pointer",
              }}>
                <span style={{
                  display: "grid", placeItems: "center",
                  width: 60, height: 60, borderRadius: 18,
                  background: cat.color,
                  fontSize: 28, flexShrink: 0,
                }}>
                  {cat.icon}
                </span>
                <div>
                  <h2 style={{
                    margin: "0 0 8px",
                    fontSize: 20, fontWeight: 700,
                    letterSpacing: "-0.02em", color: "var(--text-1)",
                  }}>
                    {cat.title}
                  </h2>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-2)" }}>
                    {cat.desc}
                  </p>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    marginTop: 16, fontSize: 14, fontWeight: 600, color: "var(--green)",
                  }}>
                    Explorar
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
