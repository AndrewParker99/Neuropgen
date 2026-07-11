"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { LogOut, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { useCms } from "@/components/CmsProvider";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { resetCmsDemo } from "@/lib/cms-store";
import { cmsSeed } from "@/lib/cms-seed";
import { slugify, sortedBlocks, sortedSections, sortedSubtopics, sortedTopics } from "@/lib/cms-utils";
import { uploadAsset } from "@/lib/content-store";
import { CmsBlock, CmsBlockType, CmsSection, CmsSite, CmsSubtopic, CmsTopic, PublishStatus } from "@/types/cms";

/* ── Tipos de bloque con descripción visual ── */
const BLOCK_TYPES: { id: CmsBlockType; emoji: string; label: string; hint: string }[] = [
  { id: "text",  emoji: "📝", label: "Texto",       hint: "Párrafo o explicación larga" },
  { id: "note",  emoji: "💬", label: "Cita / Nota", hint: "Frase destacada o consejo" },
  { id: "image", emoji: "🖼️", label: "Imagen",      hint: "Foto, diagrama o ilustración" },
  { id: "video", emoji: "▶️", label: "Video",       hint: "YouTube u otro enlace de video" },
  { id: "pdf",   emoji: "📄", label: "PDF",         hint: "Documento descargable" },
  { id: "link",  emoji: "🔗", label: "Enlace",      hint: "Recurso o página externa" },
];

/* ─────────────────────────────── */
export function CmsAdminClient() {
  const { site, setSite } = useCms();
  const [session,       setSession]       = useState<Session | null>(null);
  const [demoUnlocked,  setDemoUnlocked]  = useState(!hasSupabaseConfig);
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [loginError,    setLoginError]    = useState("");

  /* Selección actual */
  const [sectionId,  setSectionId]  = useState<CmsSection["id"]>("enfermedades");
  const [topicId,    setTopicId]    = useState("");
  const [subtopicId, setSubtopicId] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => l.subscription.unsubscribe();
  }, []);

  const sections  = useMemo(() => sortedSections(site.sections), [site]);
  const section   = sections.find((s) => s.id === sectionId) || sections[0];
  const topics    = useMemo(() => (section ? sortedTopics(section.topics) : []), [section]);
  const topic     = topics.find((t) => t.id === topicId) || null;
  const subtopics = useMemo(() => (topic ? sortedSubtopics(topic.subtopics) : []), [topic]);
  const subtopic  = subtopics.find((s) => s.id === subtopicId) || null;

  const unlocked = Boolean(session || demoUnlocked);

  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (!hasSupabaseConfig || !supabase) { setDemoUnlocked(true); return; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError("Correo o contraseña incorrectos.");
  }

  async function updateSection(next: CmsSection) {
    await setSite({ ...site, sections: site.sections.map((s) => (s.id === next.id ? next : s)) });
  }

  function createTopic() {
    if (!section) return;
    const t: CmsTopic = {
      id: crypto.randomUUID(), slug: slugify(`nuevo-tema-${section.topics.length + 1}`),
      title: "Nuevo tema", summary: "Descripción breve del tema.",
      order: section.topics.length + 1, status: "draft", subtopics: [],
    };
    updateSection({ ...section, topics: [...section.topics, t] });
    setTopicId(t.id); setSubtopicId("");
  }

  function createSubtopic() {
    if (!section || !topic) return;
    const st: CmsSubtopic = {
      id: crypto.randomUUID(), slug: slugify(`nuevo-subtema-${topic.subtopics.length + 1}`),
      title: "Nuevo subtema", order: topic.subtopics.length + 1, status: "draft", blocks: [],
    };
    const nt = { ...topic, subtopics: [...topic.subtopics, st] };
    updateSection({ ...section, topics: section.topics.map((t2) => (t2.id === topic.id ? nt : t2)) });
    setSubtopicId(st.id);
  }

  function saveTopic(next: CmsTopic) {
    if (!section) return;
    updateSection({ ...section, topics: section.topics.map((t) => (t.id === next.id ? next : t)) });
  }

  function deleteTopic(id: string) {
    if (!section) return;
    updateSection({ ...section, topics: section.topics.filter((t) => t.id !== id) });
    if (topicId === id) { setTopicId(""); setSubtopicId(""); }
  }

  function saveSubtopic(next: CmsSubtopic) {
    if (!section || !topic) return;
    const nt = { ...topic, subtopics: topic.subtopics.map((s) => (s.id === next.id ? next : s)) };
    updateSection({ ...section, topics: section.topics.map((t) => (t.id === topic.id ? nt : t)) });
  }

  function deleteSubtopic(id: string) {
    if (!section || !topic) return;
    const nt = { ...topic, subtopics: topic.subtopics.filter((s) => s.id !== id) };
    updateSection({ ...section, topics: section.topics.map((t) => (t.id === topic.id ? nt : t)) });
    if (subtopicId === id) setSubtopicId("");
  }

  /* ── LOGIN ── */
  if (!unlocked) return (
    <div style={{ maxWidth: 420, margin: "60px auto", background: "var(--surface)", borderRadius: 20, padding: 36, boxShadow: "var(--shadow-card)" }}>
      <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "var(--text-1)" }}>Acceso al editor</h1>
      <p style={{ margin: "0 0 28px", fontSize: 14, color: "var(--text-2)" }}>Ingresa con tu cuenta de administrador.</p>
      <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <AdminField label="Correo electrónico" value={email} onChange={setEmail} type="email" />
        <AdminField label="Contraseña" value={password} onChange={setPassword} type="password" />
        {loginError && <p style={{ margin: 0, padding: "10px 14px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, fontSize: 13, color: "#dc2626" }}>{loginError}</p>}
        <button type="submit" style={{ padding: "13px", background: "var(--green)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Ingresar
        </button>
      </form>
    </div>
  );

  /* ── PANEL PRINCIPAL ── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

      {/* Barra top */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--text-1)" }}>Editor de contenido</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--text-2)" }}>
            {hasSupabaseConfig ? "✓ Guardando en la nube (Supabase)" : "⚠️ Modo demo — los cambios se guardan solo en este navegador"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={async () => { resetCmsDemo(); await setSite(cmsSeed); }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1.5px solid var(--border)", borderRadius: 10, background: "var(--surface)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--text-2)" }}>
            <RefreshCw style={{ width: 14, height: 14 }} /> Restaurar demo
          </button>
          <button onClick={() => supabase ? supabase.auth.signOut() : setDemoUnlocked(false)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1.5px solid var(--border)", borderRadius: 10, background: "var(--surface)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--text-2)" }}>
            <LogOut style={{ width: 14, height: 14 }} /> Salir
          </button>
        </div>
      </div>

      {/* Indicador de pasos */}
      <StepBar step={subtopic ? 4 : topic ? 3 : 2} />

      {/* Columnas */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, marginTop: 24, alignItems: "start" }}>

        {/* ① Secciones */}
        <aside>
          <StepLabel n={1} label="Sección" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            {sections.map((s) => {
              const active = section?.id === s.id;
              return (
                <button key={s.id} onClick={() => { setSectionId(s.id); setTopicId(""); setSubtopicId(""); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", borderRadius: 12, border: "none", cursor: "pointer", textAlign: "left",
                    background: active ? "var(--green)" : "var(--surface)",
                    color:      active ? "#fff" : "var(--text-1)",
                    fontWeight: active ? 700 : 500, fontSize: 14,
                    boxShadow: "var(--shadow-card)",
                    borderLeft: active ? "none" : "3px solid transparent",
                    transition: "all .15s",
                  }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  {s.title}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ② Temas + ③ Subtemas + ④ Bloques */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ② Temas */}
          <Panel>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <StepLabel n={2} label={`Temas de "${section?.title}"`} />
              <button onClick={createTopic} style={btnGreen}>
                <Plus style={{ width: 14, height: 14 }} /> Nuevo tema
              </button>
            </div>

            {topics.length === 0 && <p style={{ color: "var(--text-3)", fontSize: 14 }}>No hay temas. Crea el primero.</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topics.map((t) => {
                const active = topic?.id === t.id;
                return (
                  <div key={t.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    padding: "12px 16px", borderRadius: 12,
                    background: active ? "var(--green-light)" : "var(--bg)",
                    border: `1.5px solid ${active ? "var(--green)" : "var(--border)"}`,
                    flexWrap: "wrap",
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: active ? "var(--green)" : "var(--text-1)" }}>{t.title}</span>
                      <span style={{ marginLeft: 10, fontSize: 11, padding: "2px 8px", borderRadius: 980, background: t.status === "published" ? "#dcfce7" : "#f3f4f6", color: t.status === "published" ? "#15803d" : "#6b7280", fontWeight: 600 }}>
                        {t.status === "published" ? "Publicado" : "Borrador"}
                      </span>
                      <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--text-3)" }}>{t.subtopics.length} subtema{t.subtopics.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <SmallBtn onClick={() => { setTopicId(t.id); setSubtopicId(""); }}>✏️ Editar</SmallBtn>
                      <SmallBtn danger onClick={() => deleteTopic(t.id)}>🗑️</SmallBtn>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Editor de tema inline */}
            {topic && (
              <TopicEditor key={topic.id} topic={topic} onSave={saveTopic} />
            )}
          </Panel>

          {/* ③ Subtemas */}
          {topic && (
            <Panel>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <StepLabel n={3} label={`Subtemas de "${topic.title}"`} />
                <button onClick={createSubtopic} style={btnGreen}>
                  <Plus style={{ width: 14, height: 14 }} /> Nuevo subtema
                </button>
              </div>

              {subtopics.length === 0 && <p style={{ color: "var(--text-3)", fontSize: 14 }}>No hay subtemas. Crea el primero.</p>}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {subtopics.map((st) => {
                  const active = subtopic?.id === st.id;
                  return (
                    <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => setSubtopicId(st.id)} style={{
                        padding: "7px 16px", borderRadius: 980, border: "none", cursor: "pointer",
                        background: active ? "var(--green)" : "var(--surface)",
                        color: active ? "#fff" : "var(--text-1)",
                        fontWeight: active ? 700 : 500, fontSize: 14,
                        boxShadow: "var(--shadow-card)",
                        transition: "all .15s",
                      }}>
                        {st.title}
                        <span style={{ marginLeft: 8, fontSize: 10, opacity: 0.7 }}>{st.status === "published" ? "✓" : "borrador"}</span>
                      </button>
                      <button onClick={() => deleteSubtopic(st.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 16, padding: "4px" }} title="Eliminar">×</button>
                    </div>
                  );
                })}
              </div>

              {subtopic && (
                <SubtopicEditor key={subtopic.id} subtopic={subtopic} onSave={saveSubtopic} />
              )}
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Topic editor ── */
function TopicEditor({ topic, onSave }: { topic: CmsTopic; onSave: (t: CmsTopic) => void }) {
  const [title,  setTitle]  = useState(topic.title);
  const [summary, setSummary] = useState(topic.summary);
  const [status, setStatus] = useState<PublishStatus>(topic.status);
  const [order,  setOrder]  = useState(topic.order);
  const [saved,  setSaved]  = useState(false);

  function save() {
    onSave({ ...topic, title: title.trim() || "Tema sin título", summary, order: Number(order) || 1, status });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ marginTop: 20, padding: 20, background: "var(--green-xlight)", borderRadius: 14, border: "1.5px solid rgba(26,143,94,.2)" }}>
      <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Editando tema</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px", gap: 12, marginBottom: 12 }}>
        <AdminField label="Título" value={title} onChange={setTitle} />
        <AdminNumber label="Orden" value={order} onChange={setOrder} />
        <AdminSelect label="Estado" value={status} onChange={(v) => setStatus(v as PublishStatus)} options={[{ value: "published", label: "✓ Publicado" }, { value: "draft", label: "Borrador" }]} />
      </div>
      <AdminArea label="Descripción breve (se muestra al paciente)" value={summary} onChange={setSummary} />
      <button onClick={save} style={{ ...btnGreen, marginTop: 12 }}>
        {saved ? "✓ Guardado" : "Guardar tema"}
      </button>
    </div>
  );
}

/* ─── Subtopic editor ── */
function SubtopicEditor({ subtopic, onSave }: { subtopic: CmsSubtopic; onSave: (s: CmsSubtopic) => void }) {
  const [title,  setTitle]  = useState(subtopic.title);
  const [status, setStatus] = useState<PublishStatus>(subtopic.status);
  const [order,  setOrder]  = useState(subtopic.order);
  const [blocks, setBlocks] = useState<CmsBlock[]>(subtopic.blocks);
  const [selBlockId, setSelBlockId] = useState(subtopic.blocks[0]?.id ?? "");

  const selBlock = blocks.find((b) => b.id === selBlockId) || blocks[0] || null;

  function commit(nextBlocks: CmsBlock[]) {
    setBlocks(nextBlocks);
    onSave({ ...subtopic, title: title.trim() || "Subtema sin título", status, order: Number(order) || 1, blocks: nextBlocks });
  }

  function addBlock(type: CmsBlockType) {
    const b: CmsBlock = { id: crypto.randomUUID(), type, order: blocks.length + 1, title: "", text: "" };
    const next = [...blocks, b];
    setSelBlockId(b.id);
    commit(next);
  }

  function saveBlock(b: CmsBlock) { commit(blocks.map((x) => (x.id === b.id ? b : x))); }
  function deleteBlock(id: string) {
    const next = blocks.filter((b) => b.id !== id);
    setSelBlockId(next[0]?.id ?? "");
    commit(next);
  }

  return (
    <div style={{ marginTop: 20, padding: 20, background: "var(--bg)", borderRadius: 14, border: "1.5px solid var(--border)" }}>
      <StepLabel n={4} label={`Bloques de "${subtopic.title}"`} />

      {/* Datos del subtema */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px", gap: 12, margin: "14px 0" }}>
        <AdminField label="Título del subtema" value={title} onChange={setTitle} />
        <AdminNumber label="Orden" value={order} onChange={setOrder} />
        <AdminSelect label="Estado" value={status} onChange={(v) => setStatus(v as PublishStatus)} options={[{ value: "published", label: "✓ Publicado" }, { value: "draft", label: "Borrador" }]} />
      </div>
      <button onClick={() => onSave({ ...subtopic, title: title.trim() || "Subtema sin título", status, order: Number(order) || 1, blocks })}
        style={{ ...btnGreen, marginBottom: 20 }}>
        Guardar subtema
      </button>

      {/* Lista de bloques existentes */}
      {blocks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {sortedBlocks(blocks).map((b) => {
            const bt = BLOCK_TYPES.find((x) => x.id === b.type)!;
            const active = selBlock?.id === b.id;
            return (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 10,
                background: active ? "var(--green-light)" : "var(--surface)",
                border: `1.5px solid ${active ? "var(--green)" : "var(--border)"}`,
                cursor: "pointer",
              }} onClick={() => setSelBlockId(b.id)}>
                <span style={{ fontSize: 18 }}>{bt.emoji}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: active ? "var(--green)" : "var(--text-1)" }}>{b.title || `(${bt.label} sin título)`}</span>
                  {b.text && <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>{b.text}</p>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteBlock(b.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 18, padding: "2px 4px" }} title="Eliminar">×</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Añadir nuevo bloque */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>Añadir nuevo bloque:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {BLOCK_TYPES.map((bt) => (
            <button key={bt.id} onClick={() => addBlock(bt.id)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "10px 14px", borderRadius: 12,
              border: "1.5px dashed var(--border)",
              background: "var(--surface)",
              cursor: "pointer", fontSize: 12, color: "var(--text-2)", fontWeight: 600,
              transition: "border-color .15s, color .15s",
              minWidth: 72,
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--green)"; (e.currentTarget as HTMLElement).style.color = "var(--green)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-2)"; }}>
              <span style={{ fontSize: 20 }}>{bt.emoji}</span>
              {bt.label}
              <span style={{ fontSize: 10, opacity: 0.7, fontWeight: 400 }}>{bt.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor del bloque seleccionado */}
      {selBlock && <BlockEditor key={selBlock.id} block={selBlock} onSave={saveBlock} />}
    </div>
  );
}

/* ─── Block editor ── */
function BlockEditor({ block, onSave }: { block: CmsBlock; onSave: (b: CmsBlock) => void }) {
  const [type,      setType]      = useState<CmsBlockType>(block.type);
  const [title,     setTitle]     = useState(block.title || "");
  const [text,      setText]      = useState(block.text || "");
  const [url,       setUrl]       = useState(block.url || "");
  const [label,     setLabel]     = useState(block.label || "");
  const [uploading, setUploading] = useState(false);
  const [saved,     setSaved]     = useState(false);

  const bt = BLOCK_TYPES.find((x) => x.id === type)!;

  function save(nextUrl = url) {
    onSave({ ...block, type, title: title.trim(), text, url: nextUrl, label });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: 20, background: "var(--surface)", borderRadius: 14, border: "1.5px solid var(--border)", marginTop: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>{bt.emoji}</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "var(--text-1)" }}>Editando bloque: {bt.label}</p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-3)" }}>{bt.hint}</p>
        </div>
      </div>

      {/* Tipo */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>Cambiar tipo de bloque:</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {BLOCK_TYPES.map((x) => (
            <button key={x.id} onClick={() => setType(x.id)} style={{
              padding: "5px 12px", borderRadius: 8, border: "1.5px solid",
              borderColor: type === x.id ? "var(--green)" : "var(--border)",
              background: type === x.id ? "var(--green-light)" : "transparent",
              color: type === x.id ? "var(--green)" : "var(--text-2)",
              fontWeight: type === x.id ? 700 : 500, fontSize: 13, cursor: "pointer",
            }}>
              {x.emoji} {x.label}
            </button>
          ))}
        </div>
      </div>

      <AdminField label="Título del bloque (encabezado que verá el paciente)" value={title} onChange={setTitle} />

      {(type === "text" || type === "note" || type === "pdf" || type === "link" || type === "video") && (
        <AdminArea
          label={type === "note" ? "Texto de la cita (lo que el paciente leerá)" : "Descripción o texto explicativo"}
          value={text} onChange={setText}
          rows={type === "text" ? 6 : 3}
        />
      )}

      {(type === "video" || type === "pdf" || type === "link" || type === "image") && (
        <AdminField
          label={type === "video" ? "URL del video (p.ej. https://youtube.com/watch?v=...)" : type === "image" ? "URL de la imagen" : "URL del recurso"}
          value={url} onChange={setUrl}
        />
      )}

      {type === "link" && (
        <AdminField label="Texto del botón (p.ej. 'Ver más información')" value={label} onChange={setLabel} />
      )}

      {(type === "image" || type === "pdf") && (
        <label style={{ display: "block", marginTop: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 8 }}>
            O sube un archivo desde tu computadora
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 18px", borderRadius: 10, border: "1.5px dashed var(--green)",
            background: "var(--green-xlight)", color: "var(--green)",
            fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>
            <Upload style={{ width: 15, height: 15 }} />
            {uploading ? "Subiendo…" : "Subir archivo"}
          </span>
          <input type="file" style={{ display: "none" }} onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            const uploadedUrl = await uploadAsset(`cms/${type}`, file);
            setUrl(uploadedUrl);
            setUploading(false);
            save(uploadedUrl);
          }} />
        </label>
      )}

      <button onClick={() => save()} style={{ ...btnGreen, marginTop: 16 }}>
        {saved ? "✓ Guardado" : "Guardar bloque"}
      </button>
    </div>
  );
}

/* ─── UI helpers ── */
const btnGreen: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "9px 18px", background: "var(--green)", color: "#fff",
  border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
  cursor: "pointer",
};

function StepBar({ step }: { step: number }) {
  const steps = ["Sección", "Tema", "Subtema", "Bloques"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 4 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 980,
            background: step >= i + 1 ? "var(--green)" : "var(--surface)",
            color: step >= i + 1 ? "#fff" : "var(--text-3)",
            fontWeight: 600, fontSize: 13,
            boxShadow: "var(--shadow-card)",
          }}>
            <span style={{ width: 18, height: 18, borderRadius: "50%", background: step >= i + 1 ? "rgba(255,255,255,.25)" : "var(--bg)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
            {s}
          </div>
          {i < steps.length - 1 && <div style={{ width: 24, height: 1, background: step > i + 1 ? "var(--green)" : "var(--border)" }} />}
        </div>
      ))}
    </div>
  );
}

function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{n}</span>
      <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-1)" }}>{label}</span>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", borderRadius: 18, padding: 24, boxShadow: "var(--shadow-card)" }}>
      {children}
    </div>
  );
}

function SmallBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 12px", borderRadius: 8, border: "1.5px solid",
      borderColor: danger ? "#fca5a5" : "var(--border)",
      background: danger ? "#fef2f2" : "var(--bg)",
      color: danger ? "#dc2626" : "var(--text-2)",
      fontWeight: 600, fontSize: 12, cursor: "pointer",
    }}>
      {children}
    </button>
  );
}

function AdminField({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 6, letterSpacing: "0.01em" }}>{label}</span>
      <input value={value} type={type} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 10, outline: "none", color: "var(--text-1)", background: "var(--bg)", fontFamily: "var(--font)", boxSizing: "border-box", transition: "border-color .15s" }}
        onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
        onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
      />
    </label>
  );
}

function AdminNumber({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>{label}</span>
      <input type="number" min={1} value={value} onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 10, outline: "none", color: "var(--text-1)", background: "var(--bg)", fontFamily: "var(--font)", boxSizing: "border-box" }}
        onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
        onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
      />
    </label>
  );
}

function AdminSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 10, background: "var(--bg)", color: "var(--text-1)", fontFamily: "var(--font)", boxSizing: "border-box" }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function AdminArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label style={{ display: "block", marginTop: 12 }}>
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 6 }}>{label}</span>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1.5px solid var(--border)", borderRadius: 10, outline: "none", color: "var(--text-1)", background: "var(--bg)", fontFamily: "var(--font)", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }}
        onFocus={e => (e.currentTarget.style.borderColor = "var(--green)")}
        onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
      />
    </label>
  );
}
