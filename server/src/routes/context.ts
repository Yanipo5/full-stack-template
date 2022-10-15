import type { inferAsyncReturnType } from "@trpc/server";
import type { RoleMap, Permission } from "../utils/authorization";
import { env } from "../envSchema";
import * as trpcExpress from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";
import * as trpc from "@trpc/server";

export type token = { id: string; roles: RoleMap };
export type Context = inferAsyncReturnType<typeof createContext>;
export type Meta = { permission: Permission };
export const createContext = (o: trpcExpress.CreateExpressContextOptions) => {
  const tokenCookie = o.req.cookies["token"];
  try {
    const user: token = tokenCookie ? verifyJwt(tokenCookie) : { id: "NULL", roles: { viewer: true } };
    return { req: o.req, res: o.res, env, user };
  } catch (error) {
    o.res.cookie("token", "");
    throw new trpc.TRPCError({ code: "UNAUTHORIZED", cause: "Invalid JWT token", message: "Please login again" });
  }
};
export const createRouter = () => trpc.router<Context, Meta>();

export const signJwt = (payload: token): string => jwt.sign(payload, env.AUTHORIZATION_SIGNATURE);
export const verifyJwt = (token: string) => jwt.verify(token, env.AUTHORIZATION_SIGNATURE) as token;
