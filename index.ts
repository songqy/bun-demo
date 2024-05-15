// const server = Bun.serve({
//   port: 3001,
//   fetch(req) {
//     return new Response("Bun!");
//   },
// });

// console.log(`Listening on http://localhost:${server.port} ...`);

import { Hono } from "hono";
const app = new Hono();

const port = 3001;

const fbi = (n: number): number => {
  if (n === 0 || n === 1) return n;
  return fbi(n - 1) + fbi(n - 2);
};

app.get("/", (c) => c.text("Hono!"));
app.get("/test", (c) => {
  let str = "str";
  const add = "adddddd";
  for (let i = 0; i < 10000; ++i) {
    str += add;
  }
  return c.json({
    str,
  });
});

app.get("/fbi/:num", (c) => {
  const num = parseInt(c.req.param("num"));
  const result = fbi(num);
  return c.text(result + "");
});

console.log(`Listening on http://localhost:${port} ...`);

export default {
  port,
  fetch: app.fetch,
};
