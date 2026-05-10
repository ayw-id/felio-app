import type express from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import {
  errorCode,
  errorResponse,
  responseErrorType,
} from "../../helpers/errorHandler";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      jwtPayload: string | JwtPayload;
    }
  }
}

export function userTokenValidation() {
  return async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const tokenKey: string = process.env.TOKEN_KEY ?? "";
    const bearer: string = req.headers.authorization ?? "";

    if (!bearer?.startsWith("Bearer ")) {
      errorResponse({
        errResponse: {
          code: errorCode[responseErrorType.authorized],
          message: "Unauthorized",
        },
        req,
        res,
        next,
      });

      return;
    }

    const token = bearer.split("Bearer ")[1].trim();

    try {
      req.jwtPayload = jwt.verify(token, tokenKey);
    } catch (err) {
      errorResponse({
        errResponse: {
          code: 401,
          message: "Unauthorized",
        },
        req,
        res,
        next,
      });

      return;
    }
    next();
  };
}
