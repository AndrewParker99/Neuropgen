import { CmsAdminClient } from "@/app/admin/CmsAdminClient";
import { PageShell } from "@/components/PageShell";

export default function AdminPage() {
  return (
    <PageShell>
      <CmsAdminClient />
    </PageShell>
  );
}
