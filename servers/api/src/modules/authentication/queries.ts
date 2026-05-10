import { PrismaClient, type seller } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

export const getUserByEmailAndPassword = async (
  email: string,
  password: string
): Promise<seller | null> | never => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const md5 = require("md5");

  return await prisma.seller.findFirst({
    where: {
      email,
      password: md5(password),
    },
  });
};

export const addUserToken = async (
  userId: number,
  role: string,
  token: string,
  action: string
): Promise<void> => {
  await prisma.user_token.create({
    data: {
      id_user: userId,
      role,
      token,
      action,
      time_added: moment().toDate(),
    },
  });
};
