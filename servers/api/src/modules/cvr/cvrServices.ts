import { type Request } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import moment from "moment";
import { type cvr_page_visit } from "@prisma/client";
import { type CVRQueryType } from "./queries";

interface CVRType {
  token: string;
  date: Date;
}

export async function updateCVR(
  cvrQueries: CVRQueryType,
  isUser: boolean,
  page: string,
  req: Request
): Promise<CVRType | null> | never {
  const guestKey = process.env.GUEST_KEY ?? "";
  const tokenKey = process.env.TOKEN_KEY ?? "";

  if (!guestKey || !tokenKey) {
    return null;
  }

  let tokenGuest = 0;

  if (req.body.guest && guestKey) {
    const jwtPayload = jwt.verify(req.body.guest as string, guestKey);
    if (typeof jwtPayload !== "string") {
      tokenGuest = jwtPayload.guest;
    }
  }

  let idGuest = 0;
  if (tokenGuest) {
    const dataGuest = await cvrQueries.getCVRGuestByToken(tokenGuest);
    if (dataGuest) {
      idGuest = dataGuest.id;
      const isUser_ = dataGuest.is_user;
      if (isUser && isUser_ === 0) {
        await cvrQueries.updateCVRGuestByToken(1, idGuest);
      }
    }
  }

  let isUnique = false;
  let isNew = false;
  const date = moment().toDate();

  if (!idGuest) {
    isUnique = true;
    idGuest = (await cvrQueries.addCVRGuestByToken(isUser ? 1 : 0))?.id ?? 0;
  }

  let cvrPageVisit: cvr_page_visit | null = null;

  let cvrPage = await cvrQueries.getCVRPageByName(page);
  if (cvrPage) {
    const idPage = cvrPage?.id ?? 0;
    cvrPageVisit = await cvrQueries.getCVRPageVisit(idPage, idGuest, date);
    if (!cvrPageVisit) {
      isNew = true;
    }
  } else {
    isNew = true;
    cvrPage = await cvrQueries.addCVRPage(page, date);
  }

  if (isNew && cvrPage) {
    await cvrQueries.addCVRPageVisit(
      cvrPage.id,
      idGuest,
      isUnique ? 1 : 0,
      date
    );
  } else if (cvrPageVisit) {
    await cvrQueries.updateCVRPageVisit(
      cvrPageVisit.count_visit + 1,
      cvrPageVisit.id
    );
  }

  return {
    token: jwt.sign({ idGuest }, tokenKey),
    date,
  };
}
