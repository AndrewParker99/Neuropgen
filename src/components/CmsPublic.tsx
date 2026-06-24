"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, Image as ImageIcon, Link2, Quote, Video } from "lucide-react";
import { useCms } from "@/components/CmsProvider";
import { sortedBlocks, sortedSubtopics, sortedTopics, publishedOnly } from "@/lib/cms-utils";
import { CmsBlock, CmsSectionSlug } from "@/types/cms";

const blockIcons: Record<CmsBlock["type"], React.ComponentType<{ className?: string }>> = {
  text: FileText,
  image: ImageIcon,
  video: Video,
  pdf: FileText,
  link: Link2,
  note: Quote
};

export function CmsPublic({ sectionSlug, topicSlug, subtopicSlug }: { sectionSlug: CmsSectionSlug; topicSlug?: string; subtopicSlug?: string }) {
  const { site, loading } = useCms();
  const [search, setSearch] = useState("");

  const section = site.sections.find((item) => item.slug === sectionSlug);
  const topics = useMemo(() => (section ? publishedOnly(sortedTopics(section.topics)) : []), [section]);

  const term = search.trim().toLowerCase();
  const filteredTopics = term
    ? topics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(term) ||
          topic.summary.toLowerCase().includes(term) ||
          topic.subtopics.some((subtopic) => subtopic.title.toLowerCase().includes(term))
      )
    : topics;

  const topic = topicSlug ? topics.find((item) => item.slug === topicSlug) : filteredTopics[0];
  const subtopics = topic ? publishedOnly(sortedSubtopics(topic.subtopics)) : [];
  const subtopic = subtopicSlug ? subtopics.find((item) => item.slug === subtopicSlug) : subtopics[0];

  if (loading) return <div className="py-16 text-center text-stone-400">Cargando…</div>;

  if (!section) {
    return <div className="py-16 text-center text-stone-400">Sección no encontrada.</div>;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-stone-200 bg-white p-7 shadow-soft">
        <p className="font-extrabold text-clinical-600">
          <Link href="/">Inicio</Link> {">"} {section.title}
        </p>
        <h1 className="mt-2 text-4xl font-black text-clinical-600 sm:text-5xl">{section.title}</h1>
        <p className="mt-2 max-w-2xl text-stone-500">{section.summary}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_220px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar temas o subtemas"
            className="min-h-[46px] rounded-2xl border border-stone-200 px-4 outline-none focus:border-clinical-400 focus:ring-2 focus:ring-clinical-100"
          />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-stone-200 bg-white p-5 shadow-soft">
          <h2 className="mb-3 text-lg font-extrabold text-clinical-600">Temas</h2>
          {filteredTopics.length === 0 ? (
            <p className="text-sm text-stone-400">No hay temas publicados todavía.</p>
          ) : (
            <div className="grid gap-2.5">
              {filteredTopics.map((item) => (
                <Link
                  key={item.id}
                  href={`/${sectionSlug}/${item.slug}`}
                  className={`rounded-2xl px-4 py-3 text-left font-extrabold ${
                    topic?.id === item.id ? "bg-clinical-500 text-white" : "bg-clinical-50 text-clinical-600 hover:bg-clinical-100"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </aside>

        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-soft">
          {!topic ? (
            <p className="text-stone-400">Selecciona un tema para ver su contenido.</p>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold text-clinical-700">{topic.title}</h2>
              <p className="mt-1 text-stone-500">{topic.summary}</p>

              <div className="mt-5 grid gap-2.5">
                {subtopics.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${sectionSlug}/${topic.slug}/${item.slug}`}
                    className={`rounded-2xl px-4 py-3 text-left font-extrabold ${
                      subtopic?.id === item.id ? "bg-clinical-500 text-white" : "bg-clinical-50 text-clinical-600 hover:bg-clinical-100"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              <div className="mt-5 grid gap-3.5">
                {!subtopic ? (
                  <p className="text-stone-400">Este tema todavía no tiene subtemas publicados.</p>
                ) : (
                  sortedBlocks(subtopic.blocks).map((block) => <BlockView key={block.id} block={block} />)
                )}
              </div>
            </>
          )}
        </section>
      </section>
    </div>
  );
}

function BlockView({ block }: { block: CmsBlock }) {
  const Icon = blockIcons[block.type];
  return (
    <article className="rounded-2xl border border-dashed border-clinical-200 bg-[#fafffc] p-4">
      <div className="flex items-center gap-2 font-extrabold text-clinical-700">
        <Icon className="h-4 w-4" /> {block.title}
      </div>
      {block.text && <p className="mt-2 text-stone-600">{block.text}</p>}
      {block.url && block.type === "video" && (
        <a href={block.url} target="_blank" rel="noreferrer" className="mt-2 inline-block font-bold text-clinical-600 underline">
          Ver video
        </a>
      )}
      {block.url && block.type === "pdf" && (
        <a href={block.url} target="_blank" rel="noreferrer" className="mt-2 inline-block font-bold text-clinical-600 underline">
          Descargar PDF
        </a>
      )}
      {block.url && block.type === "link" && (
        <a href={block.url} target="_blank" rel="noreferrer" className="mt-2 inline-block font-bold text-clinical-600 underline">
          {block.label || "Abrir enlace"}
        </a>
      )}
      {block.url && block.type === "image" && <img src={block.url} alt={block.title || ""} className="mt-2 max-h-64 rounded-xl object-cover" />}
    </article>
  );
}
