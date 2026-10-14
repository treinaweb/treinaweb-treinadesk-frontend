import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ComingSoon, ComingSoonSkeleton } from "@/components/app-shell/coming-soon";
import { parseTicketId } from "@/lib/validation/params";

export const metadata: Metadata = { title: "Chamado" };

export default function Page({ params }: PageProps<"/chamados/[id]">) {
  return (
    <Suspense fallback={<ComingSoonSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Pick<PageProps<"/chamados/[id]">, "params">) {
  const { id } = await params;
  if (!parseTicketId(id)) {
    notFound();
  }
  return <ComingSoon title="Chamado" />;
}
