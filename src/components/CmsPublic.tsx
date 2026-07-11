"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, Image as ImageIcon, Link2, Quote, Video } from "lucide-react";
import { useCms } from "@/components/CmsProvider";
import { sortedBlocks, sortedSubtopics, sortedTopics, publishedOnly } from "@/lib/cms-utils";
import { CmsBlock, CmsSectionSlug } from "@/types/cms";

const blockIcons: Record<CmsBlock["type"], React.ComponentType<{ style?: React.CSSProperties }>> = {
  text:  FileText,
  image: ImageIcon,
  video: Video,
  pdf:   FileText,
  link:  Link2,
  note:  Quote,
};

const blockColors: Record<CmsBlock["type"], string> = {
  text:  "#1a8f5e",
  image: "#7c3aed",
  video: "#0284c7",
  pdf:   "#dc2626",
  link:  "#0284c7",
  note:  "#d97706",
};

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

  if (loading) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-3)", fontSize: 15 }}>
        Cargando…
      </div>
    );
  }

  if (!section) {
    return (
      <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-3)", fontSize: 15 }}>
        Sección no encontrada.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Cabecera de sección ── */}
      <section style={{
        background: "var(--surface)",
        borderRadius: 20,
        padding: "32px 36px",
        boxShadow: "var(--shadow-card)",
      }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-3)" }}>
          <Link href="/" style={{ color: "var(--green)", textDecoration: "none", fontWeight: 500 }}>Inicio</Link>
          {" "}›{" "}
          <span style={{ color: "var(--text-2)" }}>{section.title}</span>
        </p>
        <h1 style={{
          margin: "12px 0 6px",
          fontSize: "clamp(30px, 4vw, 46px)",
          fontWeight: 800,
          letterSpacing: "-0.035em",
          color: "var(--text-1)",
          lineHeight: 1.05,
        }}>
          {section.title}
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: "var(--text-2)", lineHeight: 1.6 }}>{section.summary}</p>

        {/* Buscador */}
        <div style={{ marginTop: 20, position: "relative", maxWidth: 520 }}>
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }}
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar temas o subtemas…"
            style={{
              width: "100%",
              padding: "11px 16px 11px 40px",
              fontSize: 14,
              border: "1.5px solid var(--border)",
              borderRadius: 12,
              outline: "none",
              color: "var(--text-1)",
              background: "var(--bg)",
              fontFamily: "var(--font)",
              transition: "border-color .15s",
            }}
            onFocus={e  => (e.currentTarget.style.borderColor = "var(--green)")}
            onBlur={e   => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>
      </section>

      {/* ── Sidebar + Contenido ── */}
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "280px 1fr", alignItems: "start" }}>

        {/* Sidebar de temas */}
        <aside style={{
          background: "var(--surface)",
          borderRadius: 20,
          padding: "24px 20px",
          boxShadow: "var(--shadow-card)",
          position: "sticky",
          top: 68,
        }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-3)" }}>
            Temas
          </h2>
          {filteredTopics.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-3)", margin: 0 }}>No hay temas publicados.</p>
          ) : (
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {filteredTopics.map((t) => {
                const active = topic?.id === t.id;
                return (
                  <Link
                    key={t.id}
                    href={`/${sectionSlug}/${t.slug}`}
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      borderRadius: 10,
                      fontSize: 14,
                      fontWeight: active ? 700 : 500,
                      color:      active ? "#fff" : "var(--text-1)",
                      background: active ? "var(--green)" : "transparent",
                      textDecoration: "none",
                      transition: "background .15s, color .15s",
                    }}
                    onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "var(--green-light)"; (e.currentTarget as HTMLElement).style.color = "var(--green)"; } }}
                    onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-1)"; } }}
                  >
                    {t.title}
                  </Link>
                );
              })}
            </nav>
          )}
        </aside>

        {/* Panel de contenido */}
        <section style={{
          background: "var(--surface)",
          borderRadius: 20,
          padding: "28px 32px",
          boxShadow: "var(--shadow-card)",
          minHeight: 400,
        }}>
          {!topic ? (
            <p style={{ color: "var(--text-3)", fontSize: 15 }}>Selecciona un tema para ver su contenido.</p>
          ) : (
            <>
              <h2 style={{ margin: "0 0 4px", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-1)" }}>
                {topic.title}
              </h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--text-2)", lineHeight: 1.6 }}>{topic.summary}</p>

              {/* Pestañas de subtemas */}
              {subtopics.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
                  {subtopics.map((st) => {
                    const active = subtopic?.id === st.id;
                    return (
                      <Link
                        key={st.id}
                        href={`/${sectionSlug}/${topic.slug}/${st.slug}`}
                        style={{
                          padding: "7px 16px",
                          borderRadius: 980,
                          fontSize: 13,
                          fontWeight: 600,
                          textDecoration: "none",
                          color:      active ? "#fff" : "var(--green)",
                          background: active ? "var(--green)" : "var(--green-light)",
                          border:     active ? "none" : "none",
                          transition: "background .15s, color .15s",
                        }}
                      >
                        {st.title}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Bloques de contenido */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {!subtopic ? (
                  <p style={{ color: "var(--text-3)", fontSize: 14 }}>Este tema todavía no tiene subtemas publicados.</p>
                ) : (
                  sortedBlocks(subtopic.blocks).map((block) => (
                    <BlockView key={block.id} block={block} />
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function BlockView({ block }: { block: CmsBlock }) {
  const Icon  = blockIcons[block.type];
  const color = blockColors[block.type];

  return (
    <article style={{
      background: "var(--bg)",
      borderRadius: 14,
      padding: "18px 20px",
      border: "1px solid var(--border)",
    }}>
      {/* Header del bloque */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: block.text || block.url ? 10 : 0 }}>
        <span style={{
          display: "grid", placeItems: "center",
          width: 28, height: 28, borderRadius: 8,
          background: color + "18",
          color, flexShrink: 0,
        }}>
          <Icon style={{ width: 14, height: 14 }} />
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", letterSpacing: "-0.01em" }}>
          {block.title}
        </span>
      </div>

      {/* Contenido */}
      {block.text && (
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--text-2)" }}>
          {block.text}
        </p>
      )}
      {block.url && block.type === "image" && (
        <img src={block.url} alt={block.title || ""} style={{ marginTop: 10, maxHeight: 280, borderRadius: 10, objectFit: "cover", maxWidth: "100%" }} />
      )}
      {block.url && (block.type === "video" || block.type === "pdf" || block.type === "link") && (
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            marginTop: 10, fontSize: 13, fontWeight: 600,
            color, textDecoration: "none",
          }}
        >
          {block.type === "video" ? "Ver video" : block.type === "pdf" ? "Descargar PDF" : (block.label || "Abrir enlace")}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      )}
    </article>
  );
}
