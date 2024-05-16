import dayjs from "dayjs";

import { client, TABLE_NAME } from "./sqlite3";

export const insertUser = async (
  name: string,
  email: string,
  address: string,
  extra: Record<string, any>
) => {
  try {
    await client(TABLE_NAME.USER).insert({
      name,
      email,
      address,
      extra,
      createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
    });
  } catch (err) {
    console.error(err);
  }
};

export const searchUsers = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  try {
    return await client(TABLE_NAME.USER)
      .offset((page - 1) * size)
      .limit(size)
      .select();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getUserCount = async () => {
  try {
    const res = await client(TABLE_NAME.USER).count("* as count");
    return res[0].count;
  } catch (err) {
    console.error(err);
    return 0;
  }
};
