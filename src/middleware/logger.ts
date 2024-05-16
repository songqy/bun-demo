import type { MiddlewareHandler, Env } from "hono";

export const logger: MiddlewareHandler<Env, never, {}> = async (c, next) => {
  const url = c.req.url;
  const start = Date.now();
  await next();
  console.log(`${url} cost ${Date.now() - start}ms`);
};
