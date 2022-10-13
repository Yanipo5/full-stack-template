import type { inferAsyncReturnType } from "@trpc/server";
import { getEnv } from "../envSchema";
import * as trpcExpress from "@trpc/server/adapters/express";

import * as trpc from "@trpc/server";
export type token = { user: string; isAdmin?: boolean };
export type Context = inferAsyncReturnType<typeof createContext>;
export const createContext = (o: trpcExpress.CreateExpressContextOptions) => ({ req: o.req, res: o.res, env: getEnv() }); // no context
export const createRouter = () => trpc.router<Context>();
