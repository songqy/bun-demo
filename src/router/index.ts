import type { Hono, Env, Schema } from "hono";

import { cloneDeep } from "lodash";

import { insertUser, searchUsers, getUserCount } from "../db/user";

const fbi = (n: number): number => {
  if (n === 0 || n === 1) return n;
  return fbi(n - 1) + fbi(n - 2);
};

export const router = (app: Hono<Env, Schema, "/">) => {
  app.get("/", (c) => c.text("Hono!"));

  app.get("/test", (c) => {
    let str = c.req.query("str") || "str";
    const add = c.req.query("add") || "add";
    for (let i = 0; i < 10000; ++i) {
      str += add;
    }
    const res = cloneDeep({ str });
    return c.json(res);
  });

  app.get("/fbi/:num", (c) => {
    const num = parseInt(c.req.param("num"));
    const result = fbi(num);
    return c.text(result + "");
  });

  app.get("/users", async (c) => {
    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 50;
    const [users, count] = await Promise.all([
      searchUsers({ page, limit }),
      getUserCount(),
    ]);
    return c.json({ count, list: users });
  });

  app.post("/users", async (c) => {
    const body = (await c.req.json()) as {
      name: string;
      email: string;
      count?: number;
      address?: string;
    };
    const { name, email, count, address = "address" } = body;
    const extra = {
      extra: "extra",
    };
    if (count) {
      for (let i = 1; i <= count; i++) {
        await insertUser(
          `${name}_${i}`,
          `${email}_${i}`,
          `${address}_${i}`,
          extra
        );
      }
    } else {
      await insertUser(name, email, address, extra);
    }
    return c.json({ name, email });
  });
};
