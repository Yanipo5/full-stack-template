import type { inferAsyncReturnType } from "@trpc/server";
import * as trpc from "@trpc/server";

export const createContext = (/*o: trpcExpress.CreateExpressContextOptions*/) => ({}); // no context
export type Context = inferAsyncReturnType<typeof createContext>;
export const createRouter = () => trpc.router<Context>();
