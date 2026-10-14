import type { Metadata } from "next";
import { Suspense } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Brand } from "@/components/brand";
import { getCurrentUser } from "@/lib/auth/dal";
import { ROLE_LABELS } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-[68px] items-center justify-between gap-3 border-b border-border px-4 md:px-8">
        <Brand />
        <div className="flex min-w-0 items-center gap-4">
          <Suspense fallback={null}>
            <UserBadge />
          </Suspense>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 md:p-8">
        <Suspense fallback={<GreetingSkeleton />}>
          <Greeting />
        </Suspense>
      </main>
    </div>
  );
}

/** Nome e papel no top bar: só a partir de `sm` (no mobile ficam na saudação). */
async function UserBadge() {
  const user = await getCurrentUser();
  return (
    <div className="hidden min-w-0 flex-col items-end leading-tight sm:flex">
      <span className="max-w-48 truncate text-sm font-medium">{user.name}</span>
      <span className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</span>
    </div>
  );
}

async function Greeting() {
  const user = await getCurrentUser();
  return (
    <section className="grid gap-6">
      <div className="grid gap-3">
        <h1 className="text-2xl leading-none font-medium break-words md:text-[2rem]">
          Olá, {user.name}
        </h1>
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          Você está conectado como
          <span className="rounded-lg bg-info px-2 py-0.5 text-sm font-bold text-info-foreground">
            {ROLE_LABELS[user.role]}
          </span>
        </p>
      </div>
      <div className="rounded-panel bg-card p-6 text-sm text-card-foreground">
        Em breve seus chamados aparecerão aqui.
      </div>
    </section>
  );
}

function GreetingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando" className="grid gap-3">
      <div className="h-8 w-56 max-w-full animate-pulse rounded-md bg-muted" />
      <div className="h-5 w-72 max-w-full animate-pulse rounded-md bg-muted" />
    </div>
  );
}
