import path from "node:path";

import knex from "knex";
import fse from "fs-extra";

const filename = path.resolve("./tmp/database.db");

fse.ensureFileSync(filename);

export const client = knex({
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename,
  },
});

export const initSchema = async () => {
  try {
    const exists = await client.schema.hasTable("users");
    if (!exists) {
      await client.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name").index("name_index");
        table.string("email");
        table.string("address");
        table.timestamp("createdAt");
        table.json("extra");
      });
    }
  } catch (err) {
    console.error(err);
  }
};
