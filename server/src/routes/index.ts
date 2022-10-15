import * as trpc from "@trpc/server";
import superjson from "superjson";
import { authorize } from "../utils/authorization";
import { createRouter } from "./context";
export { createContext } from "./context";
import person from "./person.route";
import auth from "./auth.route";

export const appRouter = createRouter()
  .middleware(async ({ meta, next, ctx }) => {
    if (!meta?.permission) throw new trpc.TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: "API Missing permission" });
    if (!authorize(ctx.user.roles, meta.permission)) throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
    return next();
  })
  .transformer(superjson)
  .merge("auth.", auth)
  .merge("person.", person);
export const router = trpc.router();

export type AppRouter = typeof appRouter;
