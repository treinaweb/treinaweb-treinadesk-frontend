import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isApiError } from "@/lib/api/errors";
import type { Role } from "@/lib/api/types";
import { getMe } from "@/lib/api/users";
import { readSession } from "./cookies";
import { loginUrl } from "./notices";

/** DTO enxuto enviado à UI: nunca tokens nem o objeto bruto da API. */
export type CurrentUser = { name: string; role: Role };

/**
 * Data Access Layer: usuário logado, a partir de `GET /users/me`.
 * Para Server Components: em 401 redireciona para o login e NUNCA renova
 * tokens (Server Components não gravam cookies; a renovação é do proxy).
 * Memorizado por renderização com React `cache`.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const { accessToken } = readSession(await cookies());
  if (!accessToken) {
    redirect(loginUrl({ notice: "sessao-expirada" }));
  }

  try {
    const user = await getMe(accessToken);
    return { name: user.name, role: user.role };
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      // O proxy apaga os cookies ao ver este aviso, evitando loop login↔dashboard.
      redirect(loginUrl({ notice: "sessao-expirada" }));
    }
    throw error;
  }
});
