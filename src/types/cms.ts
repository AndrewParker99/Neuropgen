export type CmsSectionSlug = "genetico" | "neuropsicologico" | "conductual" | "recursos" | "grupo-apoyo";

export type PublishStatus = "published" | "draft";

export type CmsBlockType = "text" | "image" | "video" | "pdf" | "link" | "note";

export type CmsBlock = {
  id: string;
  type: CmsBlockType;
  title?: string;
  text?: string;
  url?: string;
  label?: string;
  order: number;
};

export type CmsSubtopic = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  order: number;
  status: PublishStatus;
  blocks: CmsBlock[];
};

export type CmsTopic = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverUrl?: string;
  order: number;
  status: PublishStatus;
  subtopics: CmsSubtopic[];
};

export type CmsSection = {
  id: CmsSectionSlug;
  slug: CmsSectionSlug;
  title: string;
  icon: string;
  summary: string;
  order: number;
  status: PublishStatus;
  topics: CmsTopic[];
};

export type CmsSite = {
  sections: CmsSection[];
  updatedAt?: string;
};

export type SearchHit = {
  section: CmsSection;
  topic: CmsTopic;
  subtopic?: CmsSubtopic;
  title: string;
  summary: string;
  href: string;
};
