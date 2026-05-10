/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
// import { logResponse } from './helpers/response'
import { helmetSettings, rateLimitSettings } from "./constants";
import rateLimit from "express-rate-limit";
import path from "path";
import AuthController from "./modules/authentication/authController";
import { type CVRQueryType } from "./modules/cvr/queries";

require("dotenv").config();
const session = require("express-session");
const helmet = require("helmet");
const cors = require("cors");
const WEBPAGE_URL = process.env.WEBPAGE_URL ?? "https://bumpp.io";

function runApp(cvrQueries: CVRQueryType): express.Application {
  const app: express.Application = express();

  // const { redisClient } = await initRedis()
  // initDB(process.env.DB_URL, redisClient)
  // await initScheduledJobs()

  // app.use(useRedis)
  // app.use(logResponse)
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(express.json({ limit: "10mb" }));
  app.use(cors());

  app.use(helmet(helmetSettings));
  app.use("/api", rateLimit(rateLimitSettings));
  app.use((req, res, next) => {
    res.set("X-Powered-By", undefined);
    res.set("X-XSS-Protection", "1; mode=block");
    res.set(
      "Strict-Transport-Security",
      "max-age=31536000;includeSubDomains;preload"
    );
    res.set(
      "Permission-Policy",
      `fullscreen=(), geolocation=(self "https://${process.env.APP_DOMAIN}")`
    );
    next();
  });

  app.use(session({ resave: true, saveUninitialized: true, secret: "bigoof" }));

  // app.use('/api/v1/apps', AppsCntrl)
  app.use("/v1/auth", AuthController(cvrQueries));
  // app.use('/api/v1/users', UsersCntrl)
  app.use("/api/docs", express.static(path.join(__dirname, "../docs")));

  app.get("/", (req, res) => {
    res.redirect(301, WEBPAGE_URL);
  });
  app.get("/c/:cardId", (req, res) => {
    res.redirect(301, `${WEBPAGE_URL}/c/${req.params.cardId}`);
  });
  app.get("/cards/:cardId", (req, res) => {
    res.redirect(301, `${WEBPAGE_URL}/c/${req.params.cardId}`);
  });

  return app;
}

export default runApp;
