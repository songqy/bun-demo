import dayjs from "dayjs";

import { client } from "./sqlite3";

export const insertUser = async (
  name: string,
  email: string,
  address: string,
  extra: Record<string, any>
) => {
  try {
    await client("users").insert({
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
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    return await client("users")
      .offset((page - 1) * limit)
      .limit(limit)
      .select();
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getUserCount = async () => {
  try {
    const res = await client("users").count('* as count');
    return res[0].count;
  } catch (err) {
    console.error(err);
    return 0;
  }
};
