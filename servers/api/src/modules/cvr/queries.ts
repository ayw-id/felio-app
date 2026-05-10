import {
  PrismaClient,
  type cvr_page_visit,
  type cvr_guest,
  type cvr_page,
} from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

export interface CVRQueryType {
  getCVRGuestByToken: (id: number) => Promise<cvr_guest | null> | never;
  updateCVRGuestByToken: (
    isUser: number,
    idGuest: number
  ) => Promise<cvr_guest | null> | never;
  addCVRGuestByToken: (idUser: number) => Promise<cvr_guest | null> | never;
  getCVRPageByName: (page: string) => Promise<cvr_page | null> | never;
  getCVRPageVisit: (
    idPage: number,
    idGuest: number,
    date: Date
  ) => Promise<cvr_page_visit | null> | never;
  addCVRPage: (page: string, date: Date) => Promise<cvr_page | null> | never;
  addCVRPageVisit: (
    idPage: number,
    idGuest: number,
    isUnique: number,
    date: Date
  ) => Promise<cvr_page_visit | null> | never;
  updateCVRPageVisit: (
    countVisit: number,
    id: number
  ) => Promise<cvr_page_visit | null> | never;
}

const getCVRGuestByToken = async (
  id: number
): Promise<cvr_guest | null> | never => {
  return await prisma.cvr_guest.findFirst({
    where: {
      id,
    },
  });
};

const updateCVRGuestByToken = async (
  isUser: number,
  idGuest: number
): Promise<cvr_guest | null> | never => {
  return await prisma.cvr_guest.update({
    where: {
      id: idGuest,
    },
    data: {
      is_user: isUser,
    },
  });
};

const addCVRGuestByToken = async (
  isUser: number
): Promise<cvr_guest | null> | never => {
  const date = moment().toDate();
  return await prisma.cvr_guest.create({
    data: {
      is_user: isUser,
      date_added: date,
    },
  });
};

const getCVRPageByName = async (
  page: string
): Promise<cvr_page | null> | never => {
  return await prisma.cvr_page.findFirst({
    where: {
      page_name: page,
    },
  });
};

const getCVRPageVisit = async (
  idPage: number,
  idGuest: number,
  date: Date
): Promise<cvr_page_visit | null> | never => {
  return await prisma.cvr_page_visit.findFirst({
    where: {
      id_page: idPage,
      id_guest: idGuest,
      date_added: date,
    },
  });
};

const addCVRPage = async (
  page: string,
  date: Date
): Promise<cvr_page | null> | never => {
  return await prisma.cvr_page.create({
    data: {
      page_name: page,
      date_added: date,
    },
  });
};

const addCVRPageVisit = async (
  idPage: number,
  idGuest: number,
  isUnique: number,
  date: Date
): Promise<cvr_page_visit | null> | never => {
  return await prisma.cvr_page_visit.create({
    data: {
      id_page: idPage,
      id_guest: idGuest,
      count_visit: 1,
      is_unique: isUnique,
      date_added: date,
    },
  });
};

const updateCVRPageVisit = async (
  countVisit: number,
  id: number
): Promise<cvr_page_visit | null> | never => {
  return await prisma.cvr_page_visit.update({
    data: {
      count_visit: countVisit,
    },
    where: {
      id,
    },
  });
};

const CVRQueries: CVRQueryType = {
  getCVRGuestByToken,
  updateCVRGuestByToken,
  addCVRGuestByToken,
  getCVRPageByName,
  getCVRPageVisit,
  addCVRPage,
  addCVRPageVisit,
  updateCVRPageVisit,
};
export default CVRQueries;
