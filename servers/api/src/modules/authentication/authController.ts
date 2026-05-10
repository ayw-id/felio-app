import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { userTokenValidation } from "./authServices";
import { addUserToken, getUserByEmailAndPassword } from "./queries";
import jwt from "jsonwebtoken";
import { loginInputValidate } from "./validation";
import { updateCVR } from "../cvr/cvrServices";
import {
  errorCode,
  errorResponse,
  responseErrorType,
} from "../../helpers/errorHandler";
import { type CVRQueryType } from "../cvr/queries";

export default function (CVRQueries: CVRQueryType): express.Router {
  const router: express.Router = express.Router();

  router.post(
    "/checkSellerToken",
    userTokenValidation(),
    (req: Request, res: Response, next: NextFunction) => {
      res.send(req.jwtPayload);
      next();
    }
  );

  router.post(
    "/email",
    async (req: Request, res: Response, next: NextFunction) => {
      const email: string = req.body.email;
      const password: string = req.body.password;

      const error = loginInputValidate(email, password);
      if (error) {
        errorResponse({
          errResponse: {
            code: error.code,
            message: error.message,
          },
          req,
          res,
          next,
        });
        return;
      }

      const seller = await getUserByEmailAndPassword(email, password);

      if (!seller) {
        errorResponse({
          errResponse: {
            code: errorCode[responseErrorType.validationFailed],
            message: "error.emailPasswordNotFound",
          },
          req,
          res,
          next,
        });
        return;
      }

      const tokenKey: string = process.env.TOKEN_KEY ?? "";
      const token: string = jwt.sign({ userId: seller.id }, tokenKey);

      await addUserToken(seller.id, "SELLER", token, "Login");

      const tokenGuest = await updateCVR(CVRQueries, true, "Login", req);

      res.send({
        token: {
          token,
          email: seller.email,
          role: "SELLER",
          is_hc: seller.hc,
        },
        tokenGuest,
      });
      next();
    }
  );

  return router;
}
