import { prisma } from "full-stack-server/src/dbClient";
export { prisma } from "full-stack-server/src/dbClient";
import _axios from "axios";
import superjson from "superjson";
import { createTRPCClient } from "@trpc/client";
import fetch from "cross-fetch";
import type { AppRouter } from "full-stack-server/src/routes/";
import { httpLink } from "@trpc/client/links/httpLink";
import { User } from "@prisma/client";

const url = "http://localhost:8080/trpc";

export const axios = _axios.create({ baseURL: url });

export const trpcClient = createTRPCClient<AppRouter>({ fetch, transformer: superjson, links: [httpLink({ url })] });

export const trpcClientBasicAuth = (user: string, password: string) => {
  const basicAuth = Buffer.from(`${user}:${password}`, "utf-8").toString("base64");
  return createTRPCClient<AppRouter>({
    fetch,
    transformer: superjson,
    links: [httpLink({ url })],
    headers: { Authorization: `Basic ${basicAuth}` }
  });
};

export class TrpcClientAuthenticated {
  private user?: User;
  private email: string;
  private password: string;
  private token?: string;
  private isAdmin: boolean;

  // Create a trpcClient that is already logged in with coockie token.
  constructor(ops?: Partial<{ admin: boolean }>) {
    this.isAdmin = Boolean(ops?.admin);
    this.email = this.isAdmin ? "admin" : `${Date.now()}@test.com`;
    this.password = this.isAdmin ? "admin" : "123456";
  }

  async init() {
    if (!this.isAdmin) this.user = await trpcClient.mutation("auth.signUp", { email: this.email, password: this.password });
    const response = await axios("/auth.login", { headers: { Authorization: `Basic ${Buffer.from(`${this.email}:${this.password}`, "utf-8").toString("base64")}` } });
    // @ts-ignore
    this.token = response.headers["set-cookie"].split(";")[0].split("=")[1] as string;
  }

  get client() {
    return createTRPCClient<AppRouter>({
      fetch,
      transformer: superjson,
      links: [httpLink({ url })],
      headers: () => ({ cookie: this.token ? `token=${this.token};` : undefined }) // Manually inserting cookie token for tests
    });
  }

  async delete() {
    if (this.user) prisma.user.delete({ where: { id: this.user.id } });
  }
}
