import { env } from "./envSchema";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";

import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext, appRouter } from "./routes";

console.log("=== env: ===");
console.dir(env);

const SERVER_PORT = 8080;

const app = express();

app.use(cookieParser());

app.use("/trpc", trpcExpress.createExpressMiddleware({ router: appRouter, createContext }));

app.use(express.static(path.resolve(__dirname, "../../client/dist")));

// app.get('*', (_, res) => res.sendFile('index.html', { root: '../client/dist' }));

app.listen(SERVER_PORT, () => console.log(`server started at port ${SERVER_PORT}`));
