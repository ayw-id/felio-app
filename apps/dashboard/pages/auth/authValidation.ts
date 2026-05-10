import { toastSeverity, toastAuth } from "~/types/systemNotification";
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import type { countryCodeType } from "~/utils/constants";
import type { ToastMessageOptions } from "primevue/toast";

interface loginDataType {
  email: string;
  password: string;
}

interface registrationDataType {
  name: string;
  email: string;
  phone: string;
  password: string;
  password1: string;
  countryCode?: countryCodeType;
}

export interface basicDataType {
  name?: string;
  email?: string;
  phone?: string;
  countryCode?: countryCodeType;
}

export const isEmailValid = (email: string) => {
  return /.+@.+/.test(email);
};

export const validateEmployeeLogin = (
  data: {
    email?: string;
    password?: string;
    password1?: string;
    otp?: string;
  },
  step: string
): ToastMessageOptions | null => {
  if (step === "email") {
    if (data.email === "") {
      return {
        severity: toastSeverity.error,
        summary: toastAuth.emailEmpty,
        detail: toastAuth.fillEmptyField,
        life: 3000,
      };
    }
    if (!isEmailValid(data.email)) {
      return {
        severity: toastSeverity.error,
        summary: toastAuth.emailNotValid,
        detail: toastAuth.correctIncorrectField,
        life: 3000,
      };
    }
  }

  if (step === "otp" && !data.otp) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.otpEmpty,
      detail: toastAuth.correctIncorrectField,
      life: 3000,
    };
  }

  if (
    data.password?.length < 8 &&
    (step === "setPassword" || step === "password")
  ) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.passwordNotValid,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
  }

  if (step === "setPassword" && data.password !== data.password1) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.passwordNotSame,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
  }
};

export const validateLogin = (
  data: loginDataType
): ToastMessageOptions | null => {
  if (data.email === "") {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.emailEmpty,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
  }
  if (!isEmailValid(data.email)) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.emailNotValid,
      detail: toastAuth.correctIncorrectField,
      life: 3000,
    };
  }
  if (!data.password) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.passwordEmpty,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
  }
  return null;
};

export const validateRegistration = (
  data: registrationDataType
): ToastMessageOptions | null => {
  if (data.name === "") {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.nameEmpty,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
  } else if (data.email === "") {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.emailEmpty,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
  } else if (!/.+@.+/.test(data.email)) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.emailNotValid,
      detail: toastAuth.correctIncorrectField,
      life: 3000,
    };
  } else if (data.phone === "") {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.phoneEmpty,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  } else if (!isValidPhoneNumber(data.phone, data.countryCode?.code)) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.phoneNotValid,
      detail: toastAuth.correctIncorrectField,
      life: 3000,
    };
  } else if (!data.password) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.passwordEmpty,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
  } else if (data.password.length < 8) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.passwordNotValid,
      detail: toastAuth.correctIncorrectField,
      life: 3000,
    };
  } else if (data.password !== data.password1) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.passwordNotSame,
      detail: toastAuth.correctIncorrectField,
      life: 3000,
    };
  }
  return null;
};

export const validateBasicData = (
  data: basicDataType
): ToastMessageOptions | null => {
  if (data.name === "") {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.nameEmpty,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
  } else if (data.email === "") {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.emailEmpty,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
  } else if (data.email !== undefined && !/.+@.+/.test(data.email)) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.emailNotValid,
      detail: toastAuth.correctIncorrectField,
      life: 3000,
    };
  } else if (data.phone === "") {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.phoneEmpty,
      detail: toastAuth.fillEmptyField,
      life: 3000,
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  } else if (
    data.phone !== undefined &&
    !isValidPhoneNumber(data.phone, data.countryCode?.code as CountryCode)
  ) {
    return {
      severity: toastSeverity.error,
      summary: toastAuth.phoneNotValid,
      detail: toastAuth.correctIncorrectField,
      life: 3000,
    };
  }
  return null;
};
