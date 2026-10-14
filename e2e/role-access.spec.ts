import { expect, test, type Page } from "@playwright/test";
import { fixedUser, loginAndWait } from "./support";

const NOT_FOUND = "Página não encontrada";

async function expectNotFound(page: Page, path: string) {
  await page.goto(path);
  await expect(page.getByRole("heading", { name: NOT_FOUND, level: 1 })).toBeVisible();
  // O nome da página vetada não aparece em lugar nenhum (nem no breadcrumb).
  await expect(page.getByRole("navigation", { name: "Você está em" })).not.toContainText(
    /Categorias|Usuários|Abrir chamado/,
  );
}

test.describe("Acesso às páginas por papel", () => {
  test("cliente não abre Usuários nem Categorias", async ({ page }) => {
    const user = fixedUser("CUSTOMER");
    await loginAndWait(page, user.email, user.password);
    await expectNotFound(page, "/usuarios");
    await expectNotFound(page, "/categorias");
  });

  test("atendente não abre Categorias nem Abrir chamado", async ({ page }) => {
    const user = fixedUser("SUPPORT");
    await loginAndWait(page, user.email, user.password);
    await expectNotFound(page, "/categorias");
    await expectNotFound(page, "/chamados/novo");
  });

  test("administrador não abre Abrir chamado", async ({ page }) => {
    const user = fixedUser("ADMIN");
    await loginAndWait(page, user.email, user.password);
    await expectNotFound(page, "/chamados/novo");
  });

  test("administrador abre Categorias e Usuários dentro da moldura", async ({ page, isMobile }) => {
    const user = fixedUser("ADMIN");
    await loginAndWait(page, user.email, user.password);

    for (const title of ["Categorias", "Usuários"]) {
      await page.goto(title === "Categorias" ? "/categorias" : "/usuarios");
      await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
      await expect(page.getByText("Esta página estará disponível em breve.")).toBeVisible();
      await expect(page.getByRole("link", { name: "Voltar ao painel" })).toBeVisible();

      const crumbs = page.getByRole("navigation", { name: "Você está em" });
      await expect(crumbs.locator('[aria-current="page"]')).toHaveText(title);
      if (isMobile) {
        // No mobile só a página atual fica visível.
        await expect(crumbs.getByRole("link", { name: "Painel" })).toBeHidden();
      } else {
        await expect(crumbs.getByRole("link", { name: "Painel" })).toHaveAttribute("href", "/dashboard");
        await expect(crumbs.locator('[aria-current="page"]')).toHaveText(title);
      }
    }
  });

  test("cliente vê Meus chamados e Abrir chamado em construção", async ({ page }) => {
    const user = fixedUser("CUSTOMER");
    await loginAndWait(page, user.email, user.password);

    await page.goto("/chamados");
    await expect(page.getByRole("heading", { name: "Meus chamados", level: 1 })).toBeVisible();
    await page.goto("/chamados/novo");
    await expect(page.getByRole("heading", { name: "Abrir chamado", level: 1 })).toBeVisible();
  });

  test("identificador de chamado inválido → não encontrado", async ({ page }) => {
    const user = fixedUser("SUPPORT");
    await loginAndWait(page, user.email, user.password);

    await page.goto("/chamados/abc");
    await expect(page.getByRole("heading", { name: NOT_FOUND, level: 1 })).toBeVisible();
    await page.goto("/chamados/2b1f0c39-6b39-4b8a-9d36-2c2a1c0e9d11");
    await expect(page.getByRole("heading", { name: "Chamado", level: 1 })).toBeVisible();
  });
});
