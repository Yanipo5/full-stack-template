import * as trpc from "@trpc/server";
import superjson from "superjson";
import { createRouter } from "./context";
export { createContext } from "./context";
import person from "./person";
import auth from "./auth.route";

export const appRouter = createRouter().transformer(superjson).merge("auth.", auth).merge("person.", person);
export const router = trpc.router();

export type AppRouter = typeof appRouter;
