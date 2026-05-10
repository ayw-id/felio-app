import runApp from "../app";

import request from "supertest";
import { userTokenValidation } from "../modules/authentication/authServices";
import httpMocks from "node-mocks-http";
import { jest } from "@jest/globals";
import {
  type cvr_page_visit,
  type cvr_guest,
  type cvr_page,
} from "@prisma/client";

const getCVRGuestByToken =
  jest.fn<(id: number) => Promise<cvr_guest | null> | never>();
const updateCVRGuestByToken =
  jest.fn<
    (isUser: number, idGuest: number) => Promise<cvr_guest | null> | never
  >();
const addCVRGuestByToken =
  jest.fn<(idUser: number) => Promise<cvr_guest | null> | never>();
const getCVRPageByName =
  jest.fn<(page: string) => Promise<cvr_page | null> | never>();
const getCVRPageVisit =
  jest.fn<
    (
      idPage: number,
      idGuest: number,
      date: Date
    ) => Promise<cvr_page_visit | null> | never
  >();
const addCVRPage =
  jest.fn<(page: string, date: Date) => Promise<cvr_page | null> | never>();
const addCVRPageVisit =
  jest.fn<
    (
      idPage: number,
      idGuest: number,
      isUnique: number,
      date: Date
    ) => Promise<cvr_page_visit | null> | never
  >();
const updateCVRPageVisit =
  jest.fn<
    (countVisit: number, id: number) => Promise<cvr_page_visit | null> | never
  >();

const app = runApp({
  getCVRGuestByToken,
  updateCVRGuestByToken,
  addCVRGuestByToken,
  getCVRPageByName,
  getCVRPageVisit,
  addCVRPage,
  addCVRPageVisit,
  updateCVRPageVisit,
});

describe("POST /auth/email", () => {
  describe("give an email and password", () => {
    // should save the email and password to the database
    // should response with json object containing the user id
    // should response with 200 status code
    // should specify json in the content type header
    test("Should response with 200 status code", async () => {
      const response = await request(app).post("/v1/auth/email").send({
        email: "felioid.biz@gmail.com",
        password: "Zzjkzind01",
      });
      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/v1/auth/email").send({
        email: "email",
        password: "password",
      });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });

    test("response has userId", async () => {
      const response = await request(app).post("/v1/auth/email").send({
        email: "felioid.biz@gmail.com",
        password: "Zzjkzind01",
      });
      expect(response.body.token.token).toBeDefined();
    });
  });

  describe("when the email or password is missing", () => {
    // should response with 400 status code
    test("should response with 400 status code", async () => {
      const bodyData = [
        { email: "felioid.bis@gmail.com" },
        { password: "Zzjkzind01" },
        {},
      ];
      for (const body of bodyData) {
        const response = await request(app).post("/v1/auth/email").send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });

  describe("get token after login then test the middleware", () => {
    test("get token after login then test the middleware", async () => {
      const response = await request(app).post("/v1/auth/email").send({
        email: "felioid.biz@gmail.com",
        password: "Zzjkzind01",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.token.token).toBeDefined();

      const req = httpMocks.createRequest({
        headers: { authorization: `Bearer ${response.body.token.token}` },
      });

      const resp = httpMocks.createResponse();
      const next = jest.fn();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await userTokenValidation()(req, resp, next);
      expect(next).toHaveBeenCalledWith();
      expect(next.call.length).toBe(1);
      expect(req.jwtPayload).toBeDefined();
    });
  });
});
