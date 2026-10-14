import "server-only";

import { apiFetch } from "./client";
import type { CreateUserDto, PublicUser } from "./types";

/** `POST /users` (público) → 201 usuário `CUSTOMER` | 400 | 409 e-mail já cadastrado. */
export function createUser(data: CreateUserDto): Promise<PublicUser> {
  return apiFetch<PublicUser>("/users", { method: "POST", body: data });
}

/** `GET /users/me` → 200 usuário autenticado | 401. */
export function getMe(accessToken: string): Promise<PublicUser> {
  return apiFetch<PublicUser>("/users/me", { accessToken });
}
