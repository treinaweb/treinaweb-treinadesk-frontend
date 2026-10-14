import "server-only";

import { apiFetch } from "./client";
import type { Category } from "./types";

/** `GET /categories` → 200 categorias ordenadas por nome (`active` só para ADMIN) | 401. */
export function listCategories(accessToken: string): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", { accessToken });
}
