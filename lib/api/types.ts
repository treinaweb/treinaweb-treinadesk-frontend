// Modelos da API TreinaDesk usados pelo frontend (ver docs/api-reference.md).

export type Role = "CUSTOMER" | "SUPPORT" | "ADMIN";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "WAITING_CUSTOMER" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface UserSummary {
  id: string;
  name: string;
  role: Role;
}

export interface CategorySummary {
  id: string;
  name: string;
}

/** `active` só vem para o ADMIN; para os demais papéis a lista já é só de ativas. */
export interface Category {
  id: string;
  name: string;
  active?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: CategorySummary;
  customer: UserSummary;
  assignee: UserSummary | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}
