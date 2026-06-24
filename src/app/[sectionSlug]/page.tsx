import { CmsPublic } from "@/components/CmsPublic";
import { PageShell } from "@/components/PageShell";
import { CmsSectionSlug } from "@/types/cms";

export function generateStaticParams() {
  return ["enfermedades", "psicoeducacion", "recursos", "grupo-apoyo"].map((sectionSlug) => ({ sectionSlug }));
}

export default function SectionPage({ params }: { params: { sectionSlug: string } }) {
  return (
    <PageShell>
      <CmsPublic sectionSlug={params.sectionSlug as CmsSectionSlug} />
    </PageShell>
  );
}
