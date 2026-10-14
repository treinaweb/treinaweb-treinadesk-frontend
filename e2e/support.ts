import { expect, test, type BrowserContext, type Page } from "@playwright/test";

export const PASSWORD = "senhaSegura123";

/** E-mail único para usuários descartáveis (nunca reutilize os fixos em testes de sessão). */
export function uniqueEmail(tag = "user") {
  const rand = Math.random().toString(36).slice(2, 8);
  return `e2e+${tag}-${Date.now()}-${rand}@treinadesk.test`;
}

export function apiUrl(path: string) {
  const base = process.env.API_BASE_URL;
  if (!base) throw new Error("API_BASE_URL não definida no .env.e2e.");
  return new URL(path, base).toString();
}

/** Cria um usuário CUSTOMER descartável direto na API (POST /users). */
export async function createDisposableUser(tag = "user") {
  const user = { name: `E2E ${tag}`, email: uniqueEmail(tag), password: PASSWORD };
  const response = await fetch(apiUrl("/users"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (response.status !== 201) {
    throw new Error(`Falha ao criar usuário descartável: ${response.status}`);
  }
  return user;
}

type FixedRole = "ADMIN" | "SUPPORT" | "CUSTOMER";

/**
 * Credenciais dos usuários fixos (somente .env.e2e). Se faltarem, o teste é
 * marcado como pulado com o motivo explícito no relatório.
 */
export function fixedUser(role: FixedRole) {
  const email = process.env[`E2E_${role}_EMAIL`];
  const password = process.env[`E2E_${role}_PASSWORD`];
  test.skip(
    !email || !password,
    `Defina E2E_${role}_EMAIL e E2E_${role}_PASSWORD no .env.e2e para rodar este teste.`,
  );
  return { email: email!, password: password! };
}

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
}

export async function loginAndWait(page: Page, email: string, password: string) {
  await login(page, email, password);
  await expect(page).toHaveURL(/\/dashboard$/);
}

export async function signup(
  page: Page,
  data: { name: string; email: string; password: string; confirmPassword?: string },
) {
  await page.goto("/cadastro");
  await page.getByLabel("Nome").fill(data.name);
  await page.getByLabel("E-mail").fill(data.email);
  await page.getByLabel("Senha", { exact: true }).fill(data.password);
  await page.getByLabel("Confirmar senha").fill(data.confirmPassword ?? data.password);
  await page.getByRole("button", { name: "Criar conta" }).click();
}

export async function sessionCookies(context: BrowserContext) {
  const cookies = await context.cookies();
  return {
    access: cookies.find((c) => c.name === "td_access"),
    refresh: cookies.find((c) => c.name === "td_refresh"),
  };
}

export function decodeJwtPayload(token: string): Record<string, unknown> {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
}
