"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/logout-action";

function LogoutSubmit() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      disabled={pending}
      className="h-11 min-w-11 rounded-md border-foreground bg-transparent px-4 text-sm font-semibold tracking-[0.05em] uppercase dark:border-foreground dark:bg-transparent"
    >
      <LogOut aria-hidden className="size-4" />
      {pending ? "Saindo..." : "Sair"}
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutSubmit />
    </form>
  );
}
