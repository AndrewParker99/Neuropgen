"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCms } from "@/components/CmsProvider";
import { sortedBlocks, sortedSubtopics, sortedTopics, publishedOnly } from "@/lib/cms-utils";
import { CmsBlock, CmsSectionSlug } from "@/types/cms";

/* ── helpers ── */
function ytId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/* ─────────────────────────────────────────────────── */
export function CmsPublic({
  sectionSlug,
  topicSlug,
  subtopicSlug,
}: {
  sectionSlug: CmsSectionSlug;
  topicSlug?: string;
  subtopicSlug?: string;
}) {
  const { site, loading } = useCms();
  const [search, setSearch] = useState("");

  const section = site.sections.find((s) => s.slug === sectionSlug);
  const topics  = useMemo(() => (section ? publishedOnly(sortedTopics(section.topics)) : []), [section]);

  const term           = search.trim().toLowerCase();
  const filteredTopics = term
    ? topics.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          t.summary.toLowerCase().includes(term) ||
          t.subtopics.some((st) => st.title.toLowerCase().includes(term))
      )
    : topics;

  const topic     = topicSlug ? topics.find((t) => t.slug === topicSlug) : filteredTopics[0];
  const subtopics = topic ? publishedOnly(sortedSubtopics(topic.subtopics)) : [];
  const subtopic  = subtopicSlug ? subtopics.find((st) => st.slug === subtopicSlug) : subtopics[0];

  if (loading) return <Msg>Cargando…</Msg>;
  if (!section) return <Msg>Sección no encontrada.</Msg>;

  return (
    <div>
      {/* ══ CABECERA ══════════════════════════════════════════ */}
      <div style={{ marginBottom: 8 }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--text-3)" }}>
          <Link href="/" style={{ color: "var(--green)", textDecoration: "none", fontWeight: 500 }}>Inicio</Link>
          {" "}›{" "}
          <span style={{ color: "var(--text-2)" }}>{section.title}</span>
          {topic && <>{" "}›{" "}<span style={{ color: "var(--text-2)" }}>{topic.title}</span></>}
        </p>

        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              margin: 0,
              fontSize: "clamp(26px, 3.5vw, 40px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-1)",
              lineHeight: 1.1,
            }}>
              {topic ? topic.title : section.title}
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--text-2)", lineHeight: 1.55 }}>
              {topic ? topic.summary : section.summary}
            </p>
          </div>

          {/* Buscador */}
          <div style={{ position: "relative", width: 280, flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }}
              aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar temas…"
              style={{
                width: "100%", padding: "10px 14px 10px 36px",
                fontSize: 14, border: "1.5px solid var(--border)",
                borderRadius: 12, outline: "none",
                color: "var(--text-1)", background: "var(--surface)",
                fontFamily: "var(--font)", transition: "border-color .15s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
              onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
      </div>

      {/* ══ LAYOUT PRINCIPAL ══════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "start", marginTop: 24 }}>

        {/* ── Sidebar de temas (sticky) ── */}
        <aside style={{
          position: "sticky",
          top: 68,
          background: "var(--surface)",
          borderRadius: 18,
          padding: "20px 16px",
          boxShadow: "var(--shadow-card)",
        }}>
          <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-3)" }}>
            Temas
          </p>
          {filteredTopics.length === 0
            ? <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0 }}>Sin resultados.</p>
            : filteredTopics.map((t) => {
                const active = topic?.id === t.id;
                return (
                  <Link key={t.id} href={`/${sectionSlug}/${t.slug}`} style={{
                    display: "block",
                    padding: "8px 12px",
                    borderRadius: 10,
                    marginBottom: 2,
                    fontSize: 14,
                    fontWeight: active ? 700 : 400,
                    color: active ? "var(--green)" : "var(--text-1)",
                    background: active ? "var(--green-light)" : "transparent",
                    textDecoration: "none",
                    lineHeight: 1.35,
                    borderLeft: active ? "3px solid var(--green)" : "3px solid transparent",
                    transition: "background .15s, color .15s",
                  }}>
                    {t.title}
                  </Link>
                );
              })
          }
        </aside>

        {/* ── Área de lectura ── */}
        <div>
          {!topic ? (
            <Msg>Selecciona un tema de la lista.</Msg>
          ) : (
            <>
              {/* Chips de subtemas */}
              {subtopics.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
                  {subtopics.map((st) => {
                    const active = subtopic?.id === st.id;
                    return (
                      <Link key={st.id} href={`/${sectionSlug}/${topic.slug}/${st.slug}`} style={{
                        padding: "8px 18px",
                        borderRadius: 980,
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                        color:      active ? "#fff" : "var(--text-2)",
                        background: active ? "var(--green)" : "var(--surface)",
                        boxShadow:  active ? "0 2px 10px rgba(26,143,94,.25)" : "var(--shadow-card)",
                        border:     active ? "none" : "1px solid var(--border)",
                        transition: "all .18s",
                      }}>
                        {st.title}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Bloques */}
              {!subtopic ? (
                <Msg>Este tema no tiene subtemas publicados aún.</Msg>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {sortedBlocks(subtopic.blocks).map((block, i) => (
                    <BlockView key={block.id} block={block} index={i} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Bloque de contenido ─────────────────────────── */
function BlockView({ block, index }: { block: CmsBlock; index: number }) {

  /* ── TEXT ── */
  if (block.type === "text") {
    return (
      <section style={{ padding: "0 0 36px", maxWidth: 720 }}>
        {block.title && (
          <h2 style={{
            margin: "0 0 12px",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "var(--text-1)",
            lineHeight: 1.2,
            paddingTop: index === 0 ? 0 : 8,
          }}>
            {block.title}
          </h2>
        )}
        {block.text && (
          <p style={{
            margin: 0,
            fontSize: 17,
            lineHeight: 1.8,
            color: "var(--text-2)",
            whiteSpace: "pre-wrap",
          }}>
            {block.text}
          </p>
        )}
      </section>
    );
  }

  /* ── NOTE ── */
  if (block.type === "note") {
    return (
      <aside style={{
        margin: "0 0 32px",
        padding: "20px 24px",
        borderLeft: "4px solid var(--green)",
        background: "var(--green-xlight)",
        borderRadius: "0 14px 14px 0",
        maxWidth: 680,
      }}>
        {block.title && <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--green)" }}>{block.title}</p>}
        {block.text  && <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--text-1)", fontStyle: "italic" }}>{block.text}</p>}
      </aside>
    );
  }

  /* ── IMAGE ── */
  if (block.type === "image" && block.url) {
    return (
      <figure style={{ margin: "0 0 36px" }}>
        <img
          src={block.url}
          alt={block.title || ""}
          style={{
            width: "100%",
            maxHeight: 480,
            objectFit: "cover",
            borderRadius: 18,
            display: "block",
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          }}
        />
        {block.title && (
          <figcaption style={{ marginTop: 10, fontSize: 13, color: "var(--text-3)", textAlign: "center", fontStyle: "italic" }}>
            {block.title}
          </figcaption>
        )}
      </figure>
    );
  }

  /* ── VIDEO ── */
  if (block.type === "video" && block.url) {
    const vid = ytId(block.url);
    return (
      <figure style={{ margin: "0 0 36px" }}>
        {block.title && <h3 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-1)" }}>{block.title}</h3>}
        {vid ? (
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
            <iframe
              src={`https://www.youtube.com/embed/${vid}`}
              title={block.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        ) : (
          <MediaCard href={block.url} label="Ver video" color="#0284c7" icon="▶" />
        )}
      </figure>
    );
  }

  /* ── PDF ── */
  if (block.type === "pdf" && block.url) {
    return (
      <div style={{ margin: "0 0 24px" }}>
        {block.title && <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>{block.title}</h3>}
        {block.text  && <p style={{ margin: "0 0 12px", fontSize: 15, color: "var(--text-2)" }}>{block.text}</p>}
        <MediaCard href={block.url} label="Descargar PDF" color="#dc2626" icon="📄" />
      </div>
    );
  }

  /* ── LINK ── */
  if (block.type === "link" && block.url) {
    return (
      <div style={{ margin: "0 0 24px" }}>
        {block.title && <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700, color: "var(--text-1)" }}>{block.title}</h3>}
        {block.text  && <p style={{ margin: "0 0 12px", fontSize: 15, color: "var(--text-2)" }}>{block.text}</p>}
        <MediaCard href={block.url} label={block.label || "Abrir enlace"} color="var(--green)" icon="🔗" />
      </div>
    );
  }

  return null;
}

/* ─── Tarjeta para PDFs y links ───────────────────── */
function MediaCard({ href, label, color, icon }: { href: string; label: string; color: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 22px",
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: 14,
        textDecoration: "none",
        fontSize: 15,
        fontWeight: 600,
        color,
        boxShadow: "var(--shadow-card)",
        transition: "box-shadow .2s, transform .2s",
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      {label}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
}

/* ─── Mensaje vacío ───────────────────────────────── */
function Msg({ children }: { children: React.ReactNode }) {
  return <p style={{ color: "var(--text-3)", fontSize: 15, padding: "40px 0" }}>{children}</p>;
}
