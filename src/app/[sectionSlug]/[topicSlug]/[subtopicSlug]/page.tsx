import { CmsPublic } from "@/components/CmsPublic";
import { PageShell } from "@/components/PageShell";
import { CmsSectionSlug } from "@/types/cms";

export default function SubtopicPage({
  params
}: {
  params: { sectionSlug: string; topicSlug: string; subtopicSlug: string };
}) {
  return (
    <PageShell>
      <CmsPublic sectionSlug={params.sectionSlug as CmsSectionSlug} topicSlug={params.topicSlug} subtopicSlug={params.subtopicSlug} />
    </PageShell>
  );
}
