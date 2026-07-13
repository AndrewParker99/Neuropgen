"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCms } from "@/components/CmsProvider";
import { sortedBlocks, sortedSubtopics, sortedTopics, publishedOnly } from "@/lib/cms-utils";
import { CmsBlock, CmsSectionSlug } from "@/types/cms";

function ytId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/* Clave de localStorage para progreso */
function progressKey(sectionSlug: string) {
  return `neuropgen_progress_${sectionSlug}`;
}

function loadProgress(sectionSlug: string): Set<string> {
  try {
    const raw = localStorage.getItem(progressKey(sectionSlug));
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function markDone(sectionSlug: string, subtopicId: string) {
  try {
    const set = loadProgress(sectionSlug);
    set.add(subtopicId);
    localStorage.setItem(progressKey(sectionSlug), JSON.stringify([...set]));
  } catch { /* noop */ }
}

/* ─── Componente principal ─── */
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
  const [search,   setSearch]   = useState("");
  const [done,     setDone]     = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string>("");   // topicId expandido en sidebar

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

  /* Abrir en el sidebar el topic activo */
  useEffect(() => {
    if (topic) setExpanded(topic.id);
  }, [topic?.id]);

  /* Cargar progreso guardado */
  useEffect(() => {
    setDone(loadProgress(sectionSlug));
  }, [sectionSlug]);

  /* Calcular progreso global de la sección */
  const totalSubtopics = topics.reduce((acc, t) => acc + publishedOnly(sortedSubtopics(t.subtopics)).length, 0);
  const doneSoFar      = topics.reduce((acc, t) =>
    acc + publishedOnly(sortedSubtopics(t.subtopics)).filter((st) => done.has(st.id)).length, 0);
  const pct = totalSubtopics > 0 ? Math.round((doneSoFar / totalSubtopics) * 100) : 0;

  /* Siguiente subtema (para botón Continuar) */
  const nextSubtopic = useMemo(() => {
    if (!topic || !subtopic) return null;
    const idx = subtopics.findIndex((st) => st.id === subtopic.id);
    if (idx < subtopics.length - 1) return { slug: subtopics[idx + 1].slug, topicSlug: topic.slug };
    // pasar al siguiente topic
    const tIdx = filteredTopics.findIndex((t) => t.id === topic.id);
    if (tIdx < filteredTopics.length - 1) {
      const nt = filteredTopics[tIdx + 1];
      const nst = publishedOnly(sortedSubtopics(nt.subtopics))[0];
      if (nst) return { slug: nst.slug, topicSlug: nt.slug };
    }
    return null;
  }, [topic, subtopic, subtopics, filteredTopics]);

  function handleContinuar() {
    if (subtopic) {
      markDone(sectionSlug, subtopic.id);
      setDone(loadProgress(sectionSlug));
    }
  }

  if (loading) return <p style={{ padding: "80px 0", textAlign: "center", color: "var(--text-3)" }}>Cargando…</p>;
  if (!section) return <p style={{ padding: "80px 0", textAlign: "center", color: "var(--text-3)" }}>Sección no encontrada.</p>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* ── Breadcrumb ── */}
      <p style={{ margin: "0 0 24px", fontSize: 13, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 6 }}>
        <Link href="/" style={{ color: "var(--green)", textDecoration: "none", fontWeight: 500 }}>Inicio</Link>
        <span>›</span>
        <Link href={`/${sectionSlug}`} style={{ color: topic ? "var(--green)" : "var(--text-2)", textDecoration: "none", fontWeight: 500 }}>
          {section.title}
        </Link>
        {topic && <><span>›</span><span style={{ color: "var(--text-2)" }}>{topic.title}</span></>}
      </p>

      {/* ── Layout: sidebar + contenido ── */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 48, alignItems: "start" }}>

        {/* ────── SIDEBAR ────── */}
        <aside style={{ position: "sticky", top: 72 }}>

          {/* Progreso global */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>
                Tu progreso
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? "var(--green)" : "var(--text-2)" }}>
                {pct}%
              </span>
            </div>
            <div style={{ height: 5, background: "var(--border)", borderRadius: 980, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${pct}%`,
                background: "var(--green)",
                borderRadius: 980,
                transition: "width .4s ease",
              }} />
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--text-3)" }}>
              {doneSoFar} de {totalSubtopics} lecciones completadas
            </p>
          </div>

          {/* Buscador */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", pointerEvents: "none" }}
              aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar…"
              style={{
                width: "100%", padding: "7px 10px 7px 30px", fontSize: 13,
                border: "1.5px solid var(--border)", borderRadius: 8, outline: "none",
                color: "var(--text-1)", background: "var(--surface)", fontFamily: "var(--font)",
                transition: "border-color .15s", boxSizing: "border-box",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
              onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Acordeón de temas + subtemas */}
          <nav aria-label="Ruta de aprendizaje">
            {filteredTopics.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>Sin resultados.</p>
            )}
            {filteredTopics.map((t) => {
              const isOpen   = expanded === t.id;
              const isActive = topic?.id === t.id;
              const tSubs    = publishedOnly(sortedSubtopics(t.subtopics));
              const tDone    = tSubs.filter((st) => done.has(st.id)).length;
              const tPct     = tSubs.length > 0 ? Math.round((tDone / tSubs.length) * 100) : 0;

              return (
                <div key={t.id} style={{ marginBottom: 4 }}>
                  {/* Encabezado del tema */}
                  <button
                    onClick={() => setExpanded(isOpen ? "" : t.id)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 10px", borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left",
                      background: isActive ? "var(--green-light)" : "transparent",
                      color: isActive ? "var(--green)" : "var(--text-1)",
                      fontWeight: isActive ? 700 : 500, fontSize: 13,
                      transition: "background .15s",
                    }}>
                    <span style={{ flex: 1, lineHeight: 1.35 }}>{t.title}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 6 }}>
                      {tPct > 0 && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: tPct === 100 ? "var(--green)" : "var(--text-3)" }}>
                          {tPct === 100 ? "✓" : `${tPct}%`}
                        </span>
                      )}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                        style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s", color: "var(--text-3)" }}>
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>

                  {/* Subtemas como pasos numerados */}
                  {isOpen && tSubs.length > 0 && (
                    <div style={{ paddingLeft: 10, marginTop: 2, marginBottom: 4 }}>
                      {tSubs.map((st, idx) => {
                        const stActive  = subtopic?.id === st.id;
                        const stDone    = done.has(st.id);
                        return (
                          <Link key={st.id} href={`/${sectionSlug}/${t.slug}/${st.slug}`} style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "7px 10px", borderRadius: 7, marginBottom: 1,
                            textDecoration: "none",
                            background: stActive ? "var(--green)" : "transparent",
                            color: stActive ? "#fff" : stDone ? "var(--text-3)" : "var(--text-2)",
                            fontSize: 13,
                            fontWeight: stActive ? 600 : 400,
                            transition: "all .15s",
                          }}>
                            {/* Número / check */}
                            <span style={{
                              width: 20, height: 20, flexShrink: 0,
                              borderRadius: "50%",
                              border: `1.5px solid ${stActive ? "rgba(255,255,255,.5)" : stDone ? "var(--green)" : "var(--border)"}`,
                              background: stDone && !stActive ? "var(--green)" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 9, fontWeight: 800,
                              color: stDone && !stActive ? "#fff" : stActive ? "#fff" : "var(--text-3)",
                            }}>
                              {stDone ? "✓" : idx + 1}
                            </span>
                            <span style={{ flex: 1, lineHeight: 1.35 }}>{st.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* ────── CONTENIDO ────── */}
        <main>
          {!topic ? (
            <p style={{ color: "var(--text-3)", fontSize: 15 }}>Selecciona un tema para comenzar a leer.</p>
          ) : (
            <>
              {/* Cabecera editorial */}
              <header style={{ borderBottom: "1px solid var(--border)", paddingBottom: 24, marginBottom: 36 }}>
                <span style={{
                  display: "inline-block", fontSize: 10, fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--green)", marginBottom: 12,
                }}>
                  {section.title}
                </span>
                <h1 className="article-title" style={{ margin: "0 0 14px" }}>
                  {subtopic ? subtopic.title : topic.title}
                </h1>
                <p className="article-deck" style={{ margin: 0 }}>
                  {topic.summary}
                </p>
              </header>

              {/* Bloques de contenido */}
              <article>
                {!subtopic ? (
                  <p style={{ color: "var(--text-3)", fontSize: 15 }}>Este tema aún no tiene lecciones publicadas.</p>
                ) : (
                  <>
                    {sortedBlocks(subtopic.blocks).map((block, i) => (
                      <BlockView key={block.id} block={block} first={i === 0} />
                    ))}

                    {/* ── Botón Continuar ── */}
                    <div style={{
                      marginTop: 60, paddingTop: 32,
                      borderTop: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      flexWrap: "wrap", gap: 16,
                    }}>
                      <div>
                        {done.has(subtopic.id) ? (
                          <span style={{ fontSize: 14, color: "var(--green)", fontWeight: 600 }}>
                            ✓ Lección completada
                          </span>
                        ) : (
                          <span style={{ fontSize: 14, color: "var(--text-3)" }}>
                            Marca esta lección como completada para llevar tu progreso.
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        {!done.has(subtopic.id) && (
                          <button
                            onClick={handleContinuar}
                            style={{
                              padding: "12px 22px", background: "var(--green)", color: "#fff",
                              border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                              cursor: "pointer",
                            }}>
                            Marcar como completada ✓
                          </button>
                        )}

                        {nextSubtopic && (
                          <Link
                            href={`/${sectionSlug}/${nextSubtopic.topicSlug}/${nextSubtopic.slug}`}
                            onClick={handleContinuar}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 8,
                              padding: "12px 22px",
                              background: done.has(subtopic.id) ? "var(--green)" : "var(--surface)",
                              color: done.has(subtopic.id) ? "#fff" : "var(--text-1)",
                              border: "1.5px solid var(--border)",
                              borderRadius: 12, fontSize: 15, fontWeight: 700,
                              textDecoration: "none",
                              transition: "all .18s",
                            }}>
                            Siguiente lección
                            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </Link>
                        )}

                        {!nextSubtopic && (
                          <Link href={`/${sectionSlug}`} onClick={handleContinuar}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 8,
                              padding: "12px 22px", background: "var(--green)", color: "#fff",
                              border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700,
                              textDecoration: "none",
                            }}>
                            🎉 ¡Sección completada! Volver al inicio
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </article>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── Bloques ─────────────────────────── */
function BlockView({ block, first }: { block: CmsBlock; first: boolean }) {

  if (block.type === "text") return (
    <section style={{ marginBottom: 40 }}>
      {block.title && (
        <h2 style={{
          fontFamily: "var(--font-editorial)", fontSize: first ? 26 : 21,
          fontWeight: 700, letterSpacing: "-0.02em",
          color: "var(--text-1)", margin: "0 0 14px", lineHeight: 1.25,
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

  if (block.type === "note") return (
    <blockquote className="pull-quote" style={{ margin: "0 0 40px" }}>
      {block.title && (
        <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--green)", marginBottom: 10, fontStyle: "normal", fontFamily: "var(--font)" }}>
          {block.title}
        </span>
      )}
      {block.text}
    </blockquote>
  );

  if (block.type === "image" && block.url) return (
    <figure style={{ margin: "0 0 48px" }}>
      <img src={block.url} alt={block.title || ""}
        style={{ width: "100%", borderRadius: 14, display: "block", boxShadow: "0 4px 32px rgba(0,0,0,0.11)" }} />
      {block.title && (
        <figcaption style={{ marginTop: 10, fontSize: 13, color: "var(--text-3)", fontFamily: "var(--font-editorial)", fontStyle: "italic", textAlign: "center" }}>
          {block.title}
        </figcaption>
      )}
    </figure>
  );

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
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.13)" }}>
            <iframe src={`https://www.youtube.com/embed/${vid}`} title={block.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
          </div>
        ) : (
          <ResourceCard href={block.url} label="Ver video" emoji="▶️" color="#0284c7" />
        )}
        {block.text && <p className="article-body" style={{ marginTop: 14, fontSize: 15 }}>{block.text}</p>}
      </figure>
    );
  }

  if (block.type === "pdf" && block.url) return (
    <div style={{ margin: "0 0 32px" }}>
      {block.title && <h3 style={{ fontFamily: "var(--font-editorial)", fontSize: 20, fontWeight: 700, margin: "0 0 10px", color: "var(--text-1)" }}>{block.title}</h3>}
      {block.text  && <p className="article-body" style={{ margin: "0 0 12px", fontSize: 16 }}>{block.text}</p>}
      <ResourceCard href={block.url} label="Descargar PDF" emoji="📄" color="#dc2626" />
    </div>
  );

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
      padding: "13px 20px", background: "var(--surface)",
      border: "1.5px solid var(--border)", borderRadius: 12,
      textDecoration: "none", fontSize: 15, fontWeight: 600, color,
      boxShadow: "var(--shadow-card)", fontFamily: "var(--font)",
    }}>
      <span style={{ fontSize: 18 }}>{emoji}</span>
      {label}
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
}
