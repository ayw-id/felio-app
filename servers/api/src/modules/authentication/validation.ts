import { errorCode, responseErrorType } from "../../helpers/errorHandler";
import emailValidator from "email-validator";

interface errorType {
  code: number;
  message: string;
}

export function loginInputValidate(
  email?: string,
  password?: string
): errorType | null {
  if (!email) {
    return {
      code: errorCode[responseErrorType.badRequest],
      message: "error.provideEmail",
    };
  }

  if (!password) {
    return {
      code: errorCode[responseErrorType.badRequest],
      message: "error.providePassword",
    };
  }

  if (!emailValidator.validate(email)) {
    return {
      code: errorCode[responseErrorType.badRequest],
      message: "error.emailNotValid",
    };
  }

  if (password?.includes(" ")) {
    return {
      code: errorCode[responseErrorType.badRequest],
      message: "error.passwordNotValid",
    };
  }

  return null;
}
