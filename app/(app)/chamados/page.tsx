import type { Metadata } from "next";
import { Suspense } from "react";
import { ComingSoon, ComingSoonSkeleton } from "@/components/app-shell/coming-soon";
import { getCurrentUser } from "@/lib/auth/dal";
import { pageTitleFor } from "@/lib/navigation/config";

export const metadata: Metadata = { title: "Chamados" };

export default function Page() {
  return (
    <Suspense fallback={<ComingSoonSkeleton />}>
      <Content />
    </Suspense>
  );
}

/** "Meus chamados" para o cliente, "Chamados" para a equipe. */
async function Content() {
  const user = await getCurrentUser();
  return <ComingSoon title={pageTitleFor(user.role, "/chamados") ?? "Chamados"} />;
}
