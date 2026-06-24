import { CmsBlock, CmsSection, CmsSubtopic, CmsTopic } from "@/types/cms";

const DIACRITICS = /[̀-ͯ]/g;

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(DIACRITICS, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || crypto.randomUUID()
  );
}

export function sortedSections(sections: CmsSection[]): CmsSection[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

export function sortedTopics(topics: CmsTopic[]): CmsTopic[] {
  return [...topics].sort((a, b) => a.order - b.order);
}

export function sortedSubtopics(subtopics: CmsSubtopic[]): CmsSubtopic[] {
  return [...subtopics].sort((a, b) => a.order - b.order);
}

export function sortedBlocks(blocks: CmsBlock[]): CmsBlock[] {
  return [...blocks].sort((a, b) => a.order - b.order);
}

export function publishedOnly<T extends { status: string }>(items: T[]): T[] {
  return items.filter((item) => item.status === "published");
}
