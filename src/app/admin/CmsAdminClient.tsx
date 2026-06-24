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

type Level = "topics" | "subtopics";

const blockTypes: { id: CmsBlockType; label: string }[] = [
  { id: "text", label: "Texto" },
  { id: "image", label: "Imagen" },
  { id: "video", label: "Video" },
  { id: "pdf", label: "PDF" },
  { id: "link", label: "Enlace" },
  { id: "note", label: "Cita o nota" }
];

export function CmsAdminClient() {
  const { site, setSite } = useCms();
  const [session, setSession] = useState<Session | null>(null);
  const [demoUnlocked, setDemoUnlocked] = useState(!hasSupabaseConfig);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sectionId, setSectionId] = useState<CmsSection["id"]>("enfermedades");
  const [topicId, setTopicId] = useState("");
  const [subtopicId, setSubtopicId] = useState("");
  const [level, setLevel] = useState<Level>("topics");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => listener.subscription.unsubscribe();
  }, []);

  const sections = useMemo(() => sortedSections(site.sections), [site]);
  const section = sections.find((item) => item.id === sectionId) || sections[0];
  const topics = useMemo(() => (section ? sortedTopics(section.topics) : []), [section]);
  const topic = topics.find((item) => item.id === topicId) || topics[0];
  const subtopics = useMemo(() => (topic ? sortedSubtopics(topic.subtopics) : []), [topic]);
  const subtopic = subtopics.find((item) => item.id === subtopicId) || subtopics[0];

  const stats = useMemo(
    () => ({
      sections: site.sections.length,
      topics: site.sections.reduce((total, item) => total + item.topics.length, 0),
      subtopics: site.sections.reduce((total, item) => total + item.topics.reduce((inner, t) => inner + t.subtopics.length, 0), 0),
      blocks: site.sections.reduce(
        (total, item) => total + item.topics.reduce((inner, t) => inner + t.subtopics.reduce((deep, s) => deep + s.blocks.length, 0), 0),
        0
      )
    }),
    [site]
  );

  const unlocked = Boolean(session || demoUnlocked);

  async function login(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!hasSupabaseConfig || !supabase) {
      setDemoUnlocked(true);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("No pudimos iniciar sesión. Revisa correo y contraseña.");
    }
  }

  async function updateSection(next: CmsSection) {
    await setSite({ ...site, sections: site.sections.map((item) => (item.id === next.id ? next : item)) });
  }

  function createTopic() {
    if (!section) return;
    const order = section.topics.length + 1;
    const newTopic: CmsTopic = {
      id: crypto.randomUUID(),
      slug: slugify(`nuevo-tema-${order}`),
      title: `Nuevo tema ${order}`,
      summary: "Escribe aquí la descripción breve del tema.",
      order,
      status: "draft",
      subtopics: []
    };
    updateSection({ ...section, topics: [...section.topics, newTopic] });
    setTopicId(newTopic.id);
    setLevel("topics");
  }

  function createSubtopic() {
    if (!section || !topic) return;
    const order = topic.subtopics.length + 1;
    const newSubtopic: CmsSubtopic = {
      id: crypto.randomUUID(),
      slug: slugify(`nuevo-subtema-${order}`),
      title: `Nuevo subtema ${order}`,
      order,
      status: "draft",
      blocks: []
    };
    const nextTopic = { ...topic, subtopics: [...topic.subtopics, newSubtopic] };
    updateSection({ ...section, topics: section.topics.map((item) => (item.id === topic.id ? nextTopic : item)) });
    setSubtopicId(newSubtopic.id);
    setLevel("subtopics");
  }

  function saveTopic(next: CmsTopic) {
    if (!section) return;
    updateSection({ ...section, topics: section.topics.map((item) => (item.id === next.id ? next : item)) });
  }

  function deleteTopic(id: string) {
    if (!section) return;
    updateSection({ ...section, topics: section.topics.filter((item) => item.id !== id) });
    if (topicId === id) setTopicId("");
  }

  function toggleTopicStatus(item: CmsTopic) {
    saveTopic({ ...item, status: item.status === "published" ? "draft" : "published" });
  }

  function saveSubtopic(next: CmsSubtopic) {
    if (!section || !topic) return;
    const nextTopic = { ...topic, subtopics: topic.subtopics.map((item) => (item.id === next.id ? next : item)) };
    updateSection({ ...section, topics: section.topics.map((item) => (item.id === topic.id ? nextTopic : item)) });
  }

  function deleteSubtopic(id: string) {
    if (!section || !topic) return;
    const nextTopic = { ...topic, subtopics: topic.subtopics.filter((item) => item.id !== id) };
    updateSection({ ...section, topics: section.topics.map((item) => (item.id === topic.id ? nextTopic : item)) });
    if (subtopicId === id) setSubtopicId("");
  }

  function toggleSubtopicStatus(item: CmsSubtopic) {
    saveSubtopic({ ...item, status: item.status === "published" ? "draft" : "published" });
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-soft">
        <h1 className="text-2xl font-extrabold text-clinical-700">Panel administrador</h1>
        <p className="mt-2 text-stone-500">Acceso protegido para administrar toda la jerarquía de contenido.</p>
        <form onSubmit={login} className="mt-6 space-y-4">
          <Field label="Correo" value={email} onChange={setEmail} type="email" />
          <Field label="Contraseña" value={password} onChange={setPassword} type="password" />
          {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
          <button className="w-full rounded-2xl bg-clinical-500 px-4 py-3 font-bold text-white hover:bg-clinical-600">Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-clinical-700">CMS NeuropGen</h1>
          <p className="mt-1 text-stone-500">Administra Sección → Tema → Subtema → Bloques sin tocar código.</p>
          <p className="mt-1 text-sm font-bold text-emerald-700">
            {hasSupabaseConfig ? "Conectado a Supabase." : "Modo demo: guarda en este navegador. Configura Supabase para guardar en la nube."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={async () => {
              resetCmsDemo();
              await setSite(cmsSeed);
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 px-4 py-2 font-bold text-stone-700 hover:bg-stone-50"
          >
            <RefreshCw className="h-4 w-4" /> Restaurar demo
          </button>
          <button
            onClick={() => (supabase ? supabase.auth.signOut() : setDemoUnlocked(false))}
            className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 px-4 py-2 font-bold text-stone-700 hover:bg-stone-50"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Secciones" value={stats.sections} />
        <Stat label="Temas" value={stats.topics} />
        <Stat label="Subtemas" value={stats.subtopics} />
        <Stat label="Bloques" value={stats.blocks} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-stone-200 bg-white p-4 shadow-soft">
          <div className="grid gap-2">
            {sections.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSectionId(item.id);
                  setTopicId("");
                  setSubtopicId("");
                  setLevel("topics");
                }}
                className={`rounded-2xl px-3.5 py-3 text-left font-extrabold ${
                  section?.id === item.id ? "bg-clinical-500 text-white" : "bg-clinical-50 text-clinical-600 hover:bg-clinical-100"
                }`}
              >
                {item.icon} {item.title}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <strong className="text-clinical-700">Biblioteca: {section?.title}</strong>
              <p className="mt-1 text-stone-500">Crea, ordena, publica o desactiva temas y subtemas.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={createSubtopic} disabled={!topic} className="rounded-2xl bg-clinical-50 px-4 py-2 font-bold text-clinical-700 disabled:opacity-40">
                Crear subtema
              </button>
              <button onClick={createTopic} className="rounded-2xl bg-clinical-500 px-4 py-2 font-bold text-white hover:bg-clinical-600">
                Crear tema
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {topics.map((item) => (
              <article key={item.id} className="rounded-2xl border border-stone-200 bg-[#f7fbf8] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#24312d]">{item.title}</h3>
                    <p className="mt-1 text-stone-500">
                      {item.subtopics.length} subtema{item.subtopics.length === 1 ? "" : "s"} · Orden {item.order}
                    </p>
                    <p className="mt-1 text-stone-500">{item.summary}</p>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-clinical-100 px-2.5 py-1 text-xs font-extrabold text-clinical-700">
                    {item.status === "published" ? "Publicado" : "Borrador"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setTopicId(item.id);
                      setSubtopicId("");
                      setLevel("topics");
                    }}
                    className="rounded-2xl bg-clinical-50 px-3.5 py-2 font-bold text-clinical-700 hover:bg-clinical-100"
                  >
                    Editar
                  </button>
                  <button onClick={() => toggleTopicStatus(item)} className="rounded-2xl bg-clinical-50 px-3.5 py-2 font-bold text-clinical-700 hover:bg-clinical-100">
                    {item.status === "published" ? "Pasar a borrador" : "Publicar"}
                  </button>
                  <button onClick={() => deleteTopic(item.id)} className="rounded-2xl bg-red-50 px-3.5 py-2 font-bold text-red-600 hover:bg-red-100">
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
            {topics.length === 0 && <p className="text-stone-400">Aún no hay temas en esta sección.</p>}
          </div>

          {topic && (
            <TopicEditor
              key={topic.id}
              topic={topic}
              onSave={saveTopic}
              subtopics={subtopics}
              selectedSubtopicId={subtopic?.id}
              onSelectSubtopic={setSubtopicId}
              onSaveSubtopic={saveSubtopic}
              onDeleteSubtopic={deleteSubtopic}
              onToggleSubtopicStatus={toggleSubtopicStatus}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function TopicEditor({
  topic,
  onSave,
  subtopics,
  selectedSubtopicId,
  onSelectSubtopic,
  onSaveSubtopic,
  onDeleteSubtopic,
  onToggleSubtopicStatus
}: {
  topic: CmsTopic;
  onSave: (topic: CmsTopic) => void;
  subtopics: CmsSubtopic[];
  selectedSubtopicId?: string;
  onSelectSubtopic: (id: string) => void;
  onSaveSubtopic: (subtopic: CmsSubtopic) => void;
  onDeleteSubtopic: (id: string) => void;
  onToggleSubtopicStatus: (subtopic: CmsSubtopic) => void;
}) {
  const [title, setTitle] = useState(topic.title);
  const [summary, setSummary] = useState(topic.summary);
  const [order, setOrder] = useState(topic.order);
  const [status, setStatus] = useState<PublishStatus>(topic.status);

  const selectedSubtopic = subtopics.find((item) => item.id === selectedSubtopicId) || subtopics[0];

  return (
    <div className="mt-6 border-t border-stone-200 pt-5">
      <h2 className="text-xl font-extrabold text-clinical-700">Editor de tema</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_160px_160px]">
        <Field label="Título del tema" value={title} onChange={setTitle} />
        <NumberField label="Orden" value={order} onChange={setOrder} />
        <SelectField
          label="Estado"
          value={status}
          onChange={(value) => setStatus(value as PublishStatus)}
          options={[
            { value: "published", label: "Publicado" },
            { value: "draft", label: "Borrador" }
          ]}
        />
      </div>
      <Area label="Descripción breve" value={summary} onChange={setSummary} />
      <button
        onClick={() => onSave({ ...topic, title: title.trim() || "Tema sin título", summary, order: Number(order) || 1, status })}
        className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-clinical-500 px-4 py-3 font-bold text-white hover:bg-clinical-600"
      >
        Guardar tema
      </button>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-clinical-50 p-4">
        <h3 className="font-extrabold text-clinical-700">Subtemas</h3>
        <div className="mt-3 grid gap-2">
          {subtopics.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3">
              <button onClick={() => onSelectSubtopic(item.id)} className="text-left font-bold text-clinical-700">
                {item.title} <span className="text-xs text-stone-400">({item.status === "published" ? "Publicado" : "Borrador"})</span>
              </button>
              <div className="flex gap-2">
                <button onClick={() => onToggleSubtopicStatus(item)} className="rounded-xl border border-stone-200 px-2.5 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50">
                  {item.status === "published" ? "A borrador" : "Publicar"}
                </button>
                <button onClick={() => onDeleteSubtopic(item.id)} className="rounded-xl border border-red-100 p-1.5 text-red-600 hover:bg-red-50" aria-label="Eliminar subtema">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {subtopics.length === 0 && <p className="text-sm text-stone-400">Aún no hay subtemas.</p>}
        </div>
      </div>

      {selectedSubtopic && (
        <SubtopicEditor key={selectedSubtopic.id} subtopic={selectedSubtopic} onSave={onSaveSubtopic} />
      )}
    </div>
  );
}

function SubtopicEditor({ subtopic, onSave }: { subtopic: CmsSubtopic; onSave: (subtopic: CmsSubtopic) => void }) {
  const [title, setTitle] = useState(subtopic.title);
  const [status, setStatus] = useState<PublishStatus>(subtopic.status);
  const [order, setOrder] = useState(subtopic.order);
  const [blocks, setBlocks] = useState<CmsBlock[]>(subtopic.blocks);
  const [selectedBlockId, setSelectedBlockId] = useState(subtopic.blocks[0]?.id);

  const selectedBlock = blocks.find((item) => item.id === selectedBlockId) || blocks[0];

  function commit(nextBlocks: CmsBlock[]) {
    setBlocks(nextBlocks);
    onSave({ ...subtopic, title: title.trim() || "Subtema sin título", status, order: Number(order) || 1, blocks: nextBlocks });
  }

  function addBlock() {
    const next: CmsBlock = { id: crypto.randomUUID(), type: "text", order: blocks.length + 1, title: "Nuevo bloque", text: "" };
    const nextBlocks = [...blocks, next];
    setSelectedBlockId(next.id);
    commit(nextBlocks);
  }

  function saveBlock(block: CmsBlock) {
    commit(blocks.map((item) => (item.id === block.id ? block : item)));
  }

  function deleteBlock(id: string) {
    const nextBlocks = blocks.filter((item) => item.id !== id);
    setSelectedBlockId(nextBlocks[0]?.id);
    commit(nextBlocks);
  }

  return (
    <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4">
      <h3 className="font-extrabold text-clinical-700">Editando subtema: {subtopic.title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_160px_160px]">
        <Field label="Título del subtema" value={title} onChange={setTitle} />
        <NumberField label="Orden" value={order} onChange={setOrder} />
        <SelectField
          label="Estado"
          value={status}
          onChange={(value) => setStatus(value as PublishStatus)}
          options={[
            { value: "published", label: "Publicado" },
            { value: "draft", label: "Borrador" }
          ]}
        />
      </div>
      <button
        onClick={() => onSave({ ...subtopic, title: title.trim() || "Subtema sin título", status, order: Number(order) || 1, blocks })}
        className="mt-3 rounded-2xl bg-clinical-500 px-4 py-2.5 font-bold text-white hover:bg-clinical-600"
      >
        Guardar subtema
      </button>

      <div className="mt-5 grid gap-2">
        {sortedBlocks(blocks).map((block) => (
          <div key={block.id} className="grid grid-cols-[140px_minmax(0,1fr)_auto] items-center gap-2.5 rounded-2xl border border-dashed border-clinical-200 bg-[#fafffc] p-2.5">
            <strong className="text-clinical-700">{blockTypes.find((item) => item.id === block.type)?.label}</strong>
            <span className="min-w-0 break-words">
              <b>{block.title}</b>
              <br />
              {block.text || block.url || "Contenido pendiente."}
            </span>
            <div className="flex gap-1.5">
              <button onClick={() => setSelectedBlockId(block.id)} className="rounded-xl border border-stone-200 px-2.5 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50">
                {selectedBlock?.id === block.id ? "Editando" : "Editar"}
              </button>
              <button onClick={() => deleteBlock(block.id)} className="rounded-xl border border-red-100 p-1.5 text-red-600 hover:bg-red-50" aria-label="Eliminar bloque">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {blocks.length === 0 && <p className="text-sm text-stone-400">Sin bloques. Agrega uno para empezar.</p>}
      </div>

      <button onClick={addBlock} className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-clinical-50 px-3.5 py-2.5 font-bold text-clinical-700 hover:bg-clinical-100">
        <Plus className="h-4 w-4" /> Agregar bloque
      </button>

      {selectedBlock && <BlockEditor key={selectedBlock.id} block={selectedBlock} onSave={saveBlock} />}
    </div>
  );
}

function BlockEditor({ block, onSave }: { block: CmsBlock; onSave: (block: CmsBlock) => void }) {
  const [type, setType] = useState<CmsBlockType>(block.type);
  const [title, setTitle] = useState(block.title || "");
  const [text, setText] = useState(block.text || "");
  const [url, setUrl] = useState(block.url || "");
  const [uploading, setUploading] = useState(false);

  function save(nextUrl = url) {
    onSave({ ...block, type, title: title.trim() || "Bloque sin título", text, url: nextUrl });
  }

  return (
    <div className="mt-5 rounded-2xl border border-stone-200 bg-clinical-50 p-4">
      <h4 className="font-extrabold text-clinical-700">Bloque seleccionado</h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <SelectField
          label="Tipo de bloque"
          value={type}
          onChange={(value) => setType(value as CmsBlockType)}
          options={blockTypes.map((item) => ({ value: item.id, label: item.label }))}
        />
        <Field label="Título del bloque" value={title} onChange={setTitle} />
        <Field label="Archivo o enlace" value={url} onChange={setUrl} placeholder="URL de YouTube, PDF, imagen o recurso" />
      </div>
      <Area label="Texto o descripción del bloque" value={text} onChange={setText} />
      <label className="mt-3 block">
        <span className="text-sm font-bold text-stone-700">Subir documento, imagen o video</span>
        <span className="mt-1.5 flex min-h-[44px] cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-clinical-300 px-3.5 text-sm font-bold text-clinical-700">
          <Upload className="h-4 w-4" /> {uploading ? "Subiendo…" : "Subir archivo"}
        </span>
        <input
          type="file"
          className="sr-only"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setUploading(true);
            const uploadedUrl = await uploadAsset(`cms/${type}`, file);
            setUrl(uploadedUrl);
            setUploading(false);
            save(uploadedUrl);
          }}
        />
      </label>
      <button onClick={() => save()} className="mt-3 rounded-2xl bg-clinical-500 px-4 py-2.5 font-bold text-white hover:bg-clinical-600">
        Guardar bloque
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-sm font-extrabold text-clinical-600">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-clinical-700">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-stone-700">{label}</span>
      <input
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 min-h-[44px] w-full rounded-2xl border border-stone-200 px-3.5 outline-none focus:border-clinical-400 focus:ring-2 focus:ring-clinical-100"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-stone-700">{label}</span>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1.5 min-h-[44px] w-full rounded-2xl border border-stone-200 px-3.5 outline-none focus:border-clinical-400 focus:ring-2 focus:ring-clinical-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-stone-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 min-h-[44px] w-full rounded-2xl border border-stone-200 px-3.5"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block">
      <span className="text-sm font-bold text-stone-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-1.5 w-full rounded-2xl border border-stone-200 px-3.5 py-2.5 outline-none focus:border-clinical-400 focus:ring-2 focus:ring-clinical-100"
      />
    </label>
  );
}
