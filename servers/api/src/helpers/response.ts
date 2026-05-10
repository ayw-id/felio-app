import type express from "express";
import sizeof from "object-sizeof";

export function logResponse(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): undefined {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const startTime = process.hrtime();
  const ip = req.headers["x-forwarded-for"] ?? req.socket.remoteAddress;
  let ipAddress = "";
  if (typeof ip === "string") {
    ipAddress = ip.split(",")[0];
  } else if (Array.isArray(ip)) {
    ipAddress = ip[0].split(",")[0];
  }

  const hrtime = process.hrtime(startTime);
  const elapsed = (hrtime[0] * 1000 + hrtime[1] / 1000000).toFixed(0) + "ms";
  const authHeader = req?.headers?.authorization?.split(" ")[1] ?? "";
  let body = "";
  if (req.method === "GET") {
    body = JSON.stringify(req.query);
  } else {
    const size = sizeof(req.body);
    if (size > 10240) {
      body = "body exceed 10kb";
    } else {
      body = JSON.stringify(req.body);
    }
  }
  console.log(
    "[",
    new Date(),
    "]",
    res.statusCode,
    req.method,
    req.originalUrl,
    ipAddress,
    req.headers["user-agent"],
    authHeader,
    body,
    elapsed
  );
  res.end.apply(res, arguments);

  next();
}
