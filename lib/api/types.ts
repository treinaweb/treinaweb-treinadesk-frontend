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
