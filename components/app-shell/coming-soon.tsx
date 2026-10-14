import Link from "next/link";
import { DASHBOARD_HREF } from "@/lib/navigation/config";

/** Página autenticada cujo conteúdo ainda não foi construído. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl leading-none font-medium break-words md:text-[2rem]">{title}</h1>
      <div className="grid gap-3 rounded-panel bg-card p-6 text-card-foreground">
        <p className="text-sm">Esta página estará disponível em breve.</p>
        <Link
          href={DASHBOARD_HREF}
          className="inline-flex min-h-11 w-fit items-center font-medium text-primary underline-offset-4 hover:underline"
        >
          Voltar ao painel
        </Link>
      </div>
    </section>
  );
}

export function ComingSoonSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando" className="grid gap-4">
      <div className="h-8 w-56 max-w-full animate-pulse rounded-md bg-muted" />
      <div className="h-28 animate-pulse rounded-panel bg-muted" />
    </div>
  );
}
