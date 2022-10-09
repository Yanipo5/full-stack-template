import * as trpc from "@trpc/server";
import superjson from "superjson";
import { createRouter } from "./context";
export { createContext } from "./context";
import person from "./person";

export const router = trpc.router();

export const appRouter = createRouter().transformer(superjson).merge("person.", person);
export type AppRouter = typeof appRouter;
