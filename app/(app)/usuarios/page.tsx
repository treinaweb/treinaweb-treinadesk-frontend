import type { Metadata } from "next";
import { Suspense } from "react";
import { ComingSoon, ComingSoonSkeleton } from "@/components/app-shell/coming-soon";
import { requireRole } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Usuários" };

export default function Page() {
  return (
    <Suspense fallback={<ComingSoonSkeleton />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  await requireRole("ADMIN");
  return <ComingSoon title="Usuários" />;
}
