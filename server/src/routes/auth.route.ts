import type { token, Context } from "./context";
import { prisma } from "../dbClient";
import { createRouter, signJwt, verifyJwt } from "./context";
export { createContext } from "./context";
import { createHash } from "crypto";
import { env } from "../envSchema";
import { z } from "zod";

const passwordToHash = (password: string) => createHash("sha256").update(password, "utf-8").digest().toString("hex");
const addCookie = (context: Context, payload: token) => context.res.cookie("token", signJwt(payload), { httpOnly: true, secure: env.SECURE_COOKIE });

export default createRouter()
  .query("login", {
    meta: { permission: "user.login" },
    async resolve(context) {
      // Authorization: scheme value
      const auth = context.ctx.req.header("Authorization");
      if (!auth) throw new Error("Missing Authorization Header");

      const [scheme, value] = auth.split(" ");
      switch (scheme) {
        case "Basic":
          const [user, password] = Buffer.from(value, "base64").toString("utf-8").split(":");
          // Admin
          if (user === "admin" && password === env.ADMIN_PASSWORD) {
            addCookie(context.ctx, { id: "admin", roles: { admin: true } });
            return;
          }

          // User
          const dbUser = await prisma.user.findFirst({ where: { email: user } });
          if (dbUser?.password_hash === passwordToHash(password)) {
            addCookie(context.ctx, { id: dbUser.id, roles: { user: true } });
            return;
          }

          // Failure
          throw new Error("Could not valudate user");

        default:
          throw new Error(`Unrecognized authentication scheme: '${scheme}'`);
      }
    }
  })

  .mutation("signUp", {
    meta: { permission: "user.create" },
    input: z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().optional() }),
    async resolve(context) {
      const { email, password, name } = context.input;
      if (email === "admin") throw new Error(`user can't be admin`);
      const password_hash = passwordToHash(password);
      const dbUser = await prisma.user.create({ data: { email, password_hash, name } });
      addCookie(context.ctx, { id: dbUser.id, roles: { user: true } });
      return dbUser;
    }
  })

  .query("validate", {
    meta: { permission: "user.validate" },
    async resolve(context) {
      return verifyJwt(context.ctx.req.cookies.token);
    }
  });
