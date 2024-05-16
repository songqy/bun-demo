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

export const TABLE_NAME = {
  USER: "user",
  ITEM: "item",
};

const initUser = async () => {
  const exists = await client.schema.hasTable(TABLE_NAME.USER);
  if (!exists) {
    await client.schema.createTable(TABLE_NAME.USER, (table) => {
      table.increments("id").primary();
      table.string("name").index("user_name_index");
      table.string("email");
      table.string("address");
      table.timestamp("createdAt");
      table.json("extra");
    });
  }
};

const initItem = async () => {
  const exists = await client.schema.hasTable(TABLE_NAME.ITEM);
  if (!exists) {
    await client.schema.createTable(TABLE_NAME.ITEM, (table) => {
      table.increments("id").primary();
      table.string("name").index("item_name_index");
      table.string("type");
      table.json("data");
      table.timestamp("createdAt");
      table.timestamp("updatedAt");
    });
  }
};

export const initSchema = async () => {
  const inits = [initUser, initItem];
  for (const fun of inits) {
    try {
      await fun();
    } catch (err) {
      console.error(err);
    }
  }
};
