import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-semibold tracking-tight">TreinaDesk</h1>
      <p className="text-muted-foreground">
        Ambiente configurado com Next.js, Tailwind CSS e shadcn/ui.
      </p>
      <div className="flex gap-3">
        <Button>Abrir chamado</Button>
        <Button variant="outline">Ver chamados</Button>
      </div>
    </main>
  );
}
