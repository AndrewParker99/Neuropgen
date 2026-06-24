import { CmsPublic } from "@/components/CmsPublic";
import { PageShell } from "@/components/PageShell";
import { CmsSectionSlug } from "@/types/cms";

export default function TopicPage({ params }: { params: { sectionSlug: string; topicSlug: string } }) {
  return (
    <PageShell>
      <CmsPublic sectionSlug={params.sectionSlug as CmsSectionSlug} topicSlug={params.topicSlug} />
    </PageShell>
  );
}
