// const server = Bun.serve({
//   port: 3001,
//   fetch(req) {
//     return new Response("Bun!");
//   },
// });

// console.log(`Listening on http://localhost:${server.port} ...`);

import { Hono } from "hono";

import { logger } from "./middleware/logger.ts";
import { router } from "./router/index.ts";
import { initSchema } from "./db/sqlite3.ts";

const app = new Hono();

app.use(logger);

router(app);

const port = 3001;

console.log(`Listening on http://localhost:${port} ...`);

initSchema();

export default {
  port,
  fetch: app.fetch,
};
