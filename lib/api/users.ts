import "server-only";

import { apiFetch } from "./client";
import type { CreateUserDto, Paginated, PublicUser } from "./types";

/** `POST /users` (público) → 201 usuário `CUSTOMER` | 400 | 409 e-mail já cadastrado. */
export function createUser(data: CreateUserDto): Promise<PublicUser> {
  return apiFetch<PublicUser>("/users", { method: "POST", body: data });
}

/** `GET /users/me` → 200 usuário autenticado | 401. */
export function getMe(accessToken: string): Promise<PublicUser> {
  return apiFetch<PublicUser>("/users/me", { accessToken });
}

/** `GET /users` (ADMIN) → 200 página de usuários (`limit` máx. 100) | 400 | 401 | 403. */
export function listUsers(
  accessToken: string,
  { page = 1, limit = 20 }: { page?: number; limit?: number } = {},
): Promise<Paginated<PublicUser>> {
  return apiFetch<Paginated<PublicUser>>(`/users?page=${page}&limit=${limit}`, { accessToken });
}
