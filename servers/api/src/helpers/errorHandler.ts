import type express from "express";
import "dotenv/config";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Response {
      message: string;
    }
  }
}

interface stackType {
  data: string;
}

interface logType {
  error: express.Errback | null;
  showParams: boolean;
  showBody: boolean;
  showQuery: boolean;
  stack: stackType | null;
}

class DomainError extends Error {
  httpCode: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // this.httpCode = this.constructor.httpCode
    Error.captureStackTrace(this, this.constructor);
  }
}

export enum responseErrorType {
  badRequest = "badRequest",
  authorized = "authorized",
  validationFailed = "validationFailed",
  notFound = "notFound",
}

export const errorCode = {
  badRequest: 400,
  authorized: 401,
  validationFailed: 422,
  notFound: 404,
};

interface errorResponseType {
  code: number;
  message: string;
}

interface errorType {
  err?: express.Errback;
  errResponse?: errorResponseType;
  req: express.Request;
  res: express.Response;
  next: express.NextFunction;
}

export function errorResponse(data: errorType): void {
  const { err, errResponse, req, res, next } = data;
  if (err) {
    if (err instanceof DomainError) {
      const httpCodeInt = err.httpCode;

      logError(err.httpCode, err.name, req, {
        error: [401, 403, 404, 422].includes(httpCodeInt) ? null : err,
        showParams: false,
        showBody: true,
        showQuery: true,
        stack: {
          data: "",
        },
      });

      res.message = err.message;

      res.status(err.httpCode).send({
        status: false,
        error: err.message,
      });
    } else if (err) {
      logError(500, "Server Error", req, {
        error: err,
        showParams: false,
        showBody: true,
        showQuery: true,
        stack: {
          data: "",
        },
      });

      res.status(500).send({
        httpCode: 500,
        message:
          "We couldn't handle your request, if this error was shown again please contact support",
      });
    }
  } else if (errResponse) {
    res.status(errResponse.code).send({
      message: errResponse.message,
    });
  }

  next();
}

export function logError(
  code: number,
  label: string,
  req: express.Request,
  options: logType
): void {
  if ([401, 403, 404].includes(code)) return;

  const {
    error = null,
    showParams = false,
    showBody = false,
    showQuery = false,
    stack = null,
  } = options;
  const requestMethod = req.method.toUpperCase();

  let message = `ERROR ${code} ${label} ${req.method} ${req.originalUrl} ${req.headers["user-agent"]} ${req.headers.authorization}`;

  if (showParams && Object.keys(req.params).length) {
    message += " " + JSON.stringify(req.params);
  }

  if (
    ["GET", "DELETE"].includes(requestMethod) &&
    showQuery &&
    Object.keys(req.query).length
  ) {
    message += " " + JSON.stringify(req.query);
  }

  if (
    ["POST", "PUT", "DELETE"].includes(requestMethod) &&
    showBody &&
    Object.keys(req.body as object).length
  ) {
    message += " " + JSON.stringify(req.body);
  }

  if (error && stack) {
    if (process.env.buildType !== "dev") {
      message += " " + JSON.stringify(stack);
    }
  }

  console.error("[", new Date(), "]", message);
}
