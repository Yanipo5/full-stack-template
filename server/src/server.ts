import path from "path";
import express from "express";
import cookieParser from "cookie-parser";

import { getEnv } from "./envSchema";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext, appRouter } from "./routes";

const env = getEnv();

console.log("=== env: ===");
console.dir(env);

const app = express();

app.use(cookieParser());

app.use("/trpc", trpcExpress.createExpressMiddleware({ router: appRouter, createContext }));

app.use(express.static(path.resolve(__dirname, "../../client/dist")));

// app.get('*', (_, res) => res.sendFile('index.html', { root: '../client/dist' }));

const SERVER_PORT = 8080;
app.listen(SERVER_PORT, () => console.log(`server started at port ${SERVER_PORT}`));
