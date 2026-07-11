"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCms } from "@/components/CmsProvider";
import { sortedBlocks, sortedSubtopics, sortedTopics, publishedOnly } from "@/lib/cms-utils";
import { CmsBlock, CmsSectionSlug } from "@/types/cms";

function ytId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

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
    ? topics.filter((t) =>
        t.title.toLowerCase().includes(term) ||
        t.summary.toLowerCase().includes(term) ||
        t.subtopics.some((st) => st.title.toLowerCase().includes(term))
      )
    : topics;

  const topic     = topicSlug ? topics.find((t) => t.slug === topicSlug) : filteredTopics[0];
  const subtopics = topic ? publishedOnly(sortedSubtopics(topic.subtopics)) : [];
  const subtopic  = subtopicSlug ? subtopics.find((st) => st.slug === subtopicSlug) : subtopics[0];

  if (loading) return <p style={{ padding: "80px 0", textAlign: "center", color: "var(--text-3)" }}>Cargando…</p>;
  if (!section) return <p style={{ padding: "80px 0", textAlign: "center", color: "var(--text-3)" }}>Sección no encontrada.</p>;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>

      {/* ── Breadcrumb ── */}
      <p style={{ margin: "0 0 20px", fontSize: 13, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6 }}>
        <Link href="/" style={{ color: "var(--green)", textDecoration: "none", fontWeight: 500 }}>Inicio</Link>
        <span>›</span>
        <Link href={`/${sectionSlug}`} style={{ color: topic ? "var(--green)" : "var(--text-2)", textDecoration: "none", fontWeight: 500 }}>
          {section.title}
        </Link>
        {topic && <><span>›</span><span style={{ color: "var(--text-2)" }}>{topic.title}</span></>}
      </p>

      {/* ── Cabecera editorial ── */}
      <header style={{ borderBottom: "1px solid var(--border)", paddingBottom: 28, marginBottom: 28 }}>
        <span style={{
          display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--green)", marginBottom: 14,
        }}>
          {section.title}
        </span>

        <h1 className="article-title" style={{ margin: "0 0 16px" }}>
          {topic ? topic.title : section.title}
        </h1>

        <p className="article-deck" style={{ margin: "0 0 20px", maxWidth: "60ch" }}>
          {topic ? topic.summary : section.summary}
        </p>

        {/* Buscador inline */}
        <div style={{ position: "relative", maxWidth: 380 }}>
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
              width: "100%", padding: "9px 14px 9px 36px",
              fontSize: 14, border: "1.5px solid var(--border)",
              borderRadius: 10, outline: "none",
              color: "var(--text-1)", background: "var(--surface)",
              fontFamily: "var(--font)", transition: "border-color .15s",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
            onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>
      </header>

      {/* ── Navegación de temas (horizontal) ── */}
      <nav aria-label="Temas" style={{ overflowX: "auto", paddingBottom: 4, marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 4, minWidth: "max-content" }}>
          {filteredTopics.map((t) => {
            const active = topic?.id === t.id;
            return (
              <Link key={t.id} href={`/${sectionSlug}/${t.slug}`} style={{
                display: "block",
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                color: active ? "var(--green)" : "var(--text-2)",
                background: active ? "var(--green-light)" : "transparent",
                textDecoration: "none",
                whiteSpace: "nowrap",
                borderBottom: active ? "2px solid var(--green)" : "2px solid transparent",
                transition: "color .15s, background .15s",
              }}>
                {t.title}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Contenido ── */}
      {!topic ? (
        <p style={{ color: "var(--text-3)", fontSize: 15 }}>Selecciona un tema para comenzar a leer.</p>
      ) : (
        <article>
          {/* Chips de subtemas */}
          {subtopics.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
              {subtopics.map((st) => {
                const active = subtopic?.id === st.id;
                return (
                  <Link key={st.id} href={`/${sectionSlug}/${topic.slug}/${st.slug}`} style={{
                    padding: "7px 18px",
                    borderRadius: 980,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: "none",
                    color:      active ? "#fff" : "var(--text-2)",
                    background: active ? "var(--green)" : "var(--surface)",
                    boxShadow:  active ? "0 2px 10px rgba(26,143,94,.22)" : "var(--shadow-card)",
                    border:     active ? "none" : "1px solid var(--border)",
                    transition: "all .18s",
                  }}>
                    {st.title}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Bloques de contenido */}
          {!subtopic ? (
            <p style={{ color: "var(--text-3)", fontSize: 15 }}>Este tema aún no tiene subtemas publicados.</p>
          ) : (
            <div>
              {sortedBlocks(subtopic.blocks).map((block, i) => (
                <BlockView key={block.id} block={block} first={i === 0} />
              ))}
            </div>
          )}
        </article>
      )}
    </div>
  );
}

/* ─── Bloque editorial ─────────────────────────── */
function BlockView({ block, first }: { block: CmsBlock; first: boolean }) {

  /* TEXT */
  if (block.type === "text") return (
    <section style={{ marginBottom: 40 }}>
      {block.title && (
        <h2 style={{
          fontFamily: "var(--font-editorial)",
          fontSize: first ? 28 : 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--text-1)",
          margin: "0 0 16px",
          lineHeight: 1.2,
        }}>
          {block.title}
        </h2>
      )}
      {block.text && (
        <p className="article-body" style={{ margin: 0, whiteSpace: "pre-wrap" }}>
          {block.text}
        </p>
      )}
    </section>
  );

  /* NOTE / PULL QUOTE */
  if (block.type === "note") return (
    <blockquote className="pull-quote" style={{ margin: "0 0 40px" }}>
      {block.title && (
        <span style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--green)", marginBottom: 10, fontStyle: "normal", fontFamily: "var(--font)" }}>
          {block.title}
        </span>
      )}
      {block.text}
    </blockquote>
  );

  /* IMAGE */
  if (block.type === "image" && block.url) return (
    <figure style={{ margin: "0 0 48px" }}>
      <img
        src={block.url}
        alt={block.title || ""}
        style={{ width: "100%", borderRadius: 16, display: "block", boxShadow: "0 4px 32px rgba(0,0,0,0.11)" }}
      />
      {block.title && (
        <figcaption style={{
          marginTop: 12, fontSize: 13, color: "var(--text-3)",
          fontFamily: "var(--font-editorial)", fontStyle: "italic", textAlign: "center",
        }}>
          {block.title}
        </figcaption>
      )}
    </figure>
  );

  /* VIDEO */
  if (block.type === "video" && block.url) {
    const vid = ytId(block.url);
    return (
      <figure style={{ margin: "0 0 48px" }}>
        {block.title && (
          <h3 style={{ fontFamily: "var(--font-editorial)", fontSize: 20, fontWeight: 700, margin: "0 0 14px", color: "var(--text-1)" }}>
            {block.title}
          </h3>
        )}
        {vid ? (
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.13)" }}>
            <iframe
              src={`https://www.youtube.com/embed/${vid}`}
              title={block.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        ) : (
          <ResourceCard href={block.url} label="Ver video" emoji="▶️" color="#0284c7" />
        )}
        {block.text && <p className="article-body" style={{ marginTop: 14, fontSize: 15 }}>{block.text}</p>}
      </figure>
    );
  }

  /* PDF */
  if (block.type === "pdf" && block.url) return (
    <div style={{ margin: "0 0 32px" }}>
      {block.title && <h3 style={{ fontFamily: "var(--font-editorial)", fontSize: 20, fontWeight: 700, margin: "0 0 10px", color: "var(--text-1)" }}>{block.title}</h3>}
      {block.text  && <p className="article-body" style={{ margin: "0 0 12px", fontSize: 16 }}>{block.text}</p>}
      <ResourceCard href={block.url} label="Descargar PDF" emoji="📄" color="#dc2626" />
    </div>
  );

  /* LINK */
  if (block.type === "link" && block.url) return (
    <div style={{ margin: "0 0 32px" }}>
      {block.title && <h3 style={{ fontFamily: "var(--font-editorial)", fontSize: 20, fontWeight: 700, margin: "0 0 10px", color: "var(--text-1)" }}>{block.title}</h3>}
      {block.text  && <p className="article-body" style={{ margin: "0 0 12px", fontSize: 16 }}>{block.text}</p>}
      <ResourceCard href={block.url} label={block.label || "Abrir enlace"} emoji="🔗" color="var(--green)" />
    </div>
  );

  return null;
}

function ResourceCard({ href, label, emoji, color }: { href: string; label: string; emoji: string; color: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      padding: "14px 22px",
      background: "var(--surface)",
      border: "1.5px solid var(--border)",
      borderRadius: 14,
      textDecoration: "none",
      fontSize: 15, fontWeight: 600, color,
      boxShadow: "var(--shadow-card)",
      fontFamily: "var(--font)",
    }}>
      <span style={{ fontSize: 18 }}>{emoji}</span>
      {label}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
}
