import "server-only";

import { cache } from "react";
import { apiFetch } from "./client";
import type { Paginated, Ticket, TicketPriority, TicketStatus } from "./types";

export type TicketFilters = {
  page?: number;
  /** Máximo 50 na API. */
  limit?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
};

/**
 * `GET /tickets` → 200 página de tickets visíveis ao papel (mais recentes
 * primeiro) | 400 | 401.
 */
export function listTickets(accessToken: string, filters: TicketFilters = {}) {
  const query = new URLSearchParams();
  for (const key of ["page", "limit", "status", "priority"] as const) {
    const value = filters[key];
    if (value !== undefined) query.set(key, String(value));
  }
  const suffix = query.size > 0 ? `?${query}` : "";
  return apiFetch<Paginated<Ticket>>(`/tickets${suffix}`, { accessToken });
}

/**
 * Quantidade de tickets visíveis com os filtros (lê só o `total`).
 * Memorizado por renderização: argumentos primitivos para o `cache` do React
 * reaproveitar a mesma chamada entre cartões e gráficos.
 */
export const countTickets = cache(
  async (accessToken: string, status?: TicketStatus, priority?: TicketPriority) => {
    const page = await listTickets(accessToken, { limit: 1, status, priority });
    return page.total;
  },
);
