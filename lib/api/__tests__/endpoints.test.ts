import { beforeEach, describe, expect, it, vi } from "vitest";
import { login, logout, refresh } from "@/lib/api/auth";
import { createUser, getMe } from "@/lib/api/users";
import { resetApiBaseUrlCache } from "@/lib/env";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  resetApiBaseUrlCache();
  vi.stubEnv("API_BASE_URL", "http://api.test");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => new Response("{}", { status: 200 }));
});

function lastCall() {
  const [url, init] = fetchMock.mock.calls.at(-1)!;
  const headers = (init?.headers ?? {}) as Record<string, string>;
  return {
    url,
    method: init?.method,
    body: init?.body ? JSON.parse(init.body as string) : undefined,
    auth: headers.Authorization,
  };
}

describe("endpoints de auth e users", () => {
  it("login → POST /auth/login", async () => {
    await login({ email: "a@b.co", password: "x" });
    expect(lastCall()).toEqual({
      url: "http://api.test/auth/login",
      method: "POST",
      body: { email: "a@b.co", password: "x" },
      auth: undefined,
    });
  });

  it("refresh → POST /auth/refresh", async () => {
    await refresh("r1");
    expect(lastCall()).toMatchObject({
      url: "http://api.test/auth/refresh",
      method: "POST",
      body: { refreshToken: "r1" },
    });
  });

  it("logout → POST /auth/logout com Bearer e refresh no corpo", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await logout("a1", "r1");
    expect(lastCall()).toEqual({
      url: "http://api.test/auth/logout",
      method: "POST",
      body: { refreshToken: "r1" },
      auth: "Bearer a1",
    });
  });

  it("createUser → POST /users", async () => {
    await createUser({ name: "Ana", email: "ana@teste.com", password: "12345678" });
    expect(lastCall()).toMatchObject({
      url: "http://api.test/users",
      method: "POST",
      body: { name: "Ana", email: "ana@teste.com", password: "12345678" },
    });
  });

  it("getMe → GET /users/me com Bearer", async () => {
    await getMe("a1");
    expect(lastCall()).toMatchObject({
      url: "http://api.test/users/me",
      method: "GET",
      auth: "Bearer a1",
    });
  });
});
