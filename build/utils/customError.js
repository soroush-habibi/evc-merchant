export var errorEnum;
(function (errorEnum) {
    errorEnum[errorEnum["INTERNAL_ERROR"] = 9999] = "INTERNAL_ERROR";
    errorEnum[errorEnum["ENV"] = 101] = "ENV";
    errorEnum[errorEnum["JOI_ERROR"] = 102] = "JOI_ERROR";
    errorEnum[errorEnum["AUTH_ERROR"] = 103] = "AUTH_ERROR";
    errorEnum[errorEnum["ACTIVE_OTP"] = 104] = "ACTIVE_OTP";
    errorEnum[errorEnum["NO_OTP"] = 105] = "NO_OTP";
    errorEnum[errorEnum["WRONG_OTP"] = 106] = "WRONG_OTP";
    errorEnum[errorEnum["USER_NOT_FOUND"] = 107] = "USER_NOT_FOUND";
    errorEnum[errorEnum["ALREADY_REGISTERED"] = 108] = "ALREADY_REGISTERED";
    errorEnum[errorEnum["WRONG_PASSWORD"] = 109] = "WRONG_PASSWORD";
    errorEnum[errorEnum["EMAIL_REGISTERED_ALREADY"] = 110] = "EMAIL_REGISTERED_ALREADY";
})(errorEnum = errorEnum || (errorEnum = {}));
export class CustomErrorClass {
    static noEnv(varName) {
        return {
            name: "ENV",
            code: errorEnum.ENV,
            httpCode: 500,
            message: varName
        };
    }
    static internalError() {
        return {
            name: "INTERNAL_ERROR",
            code: errorEnum.INTERNAL_ERROR,
            httpCode: 500
        };
    }
    static joiError(message) {
        return {
            name: "JOI_ERROR",
            code: errorEnum.JOI_ERROR,
            httpCode: 400,
            message: message
        };
    }
    static authError() {
        return {
            name: "AUTH_ERROR",
            code: errorEnum.AUTH_ERROR,
            httpCode: 403
        };
    }
    static activeOtp() {
        return {
            name: "ACTIVE_OTP",
            code: errorEnum.ACTIVE_OTP,
            httpCode: 400
        };
    }
    static userNotFound() {
        return {
            name: "USER_NOT_FOUND",
            code: errorEnum.USER_NOT_FOUND,
            httpCode: 404
        };
    }
    static noOtp() {
        return {
            name: "NO_OTP",
            code: errorEnum.NO_OTP,
            httpCode: 404
        };
    }
    static wrongOtp() {
        return {
            name: "WRONG_OTP",
            code: errorEnum.WRONG_OTP,
            httpCode: 400
        };
    }
    static alreadyRegistered() {
        return {
            name: "ALREADY_REGISTERED",
            code: errorEnum.ALREADY_REGISTERED,
            httpCode: 400
        };
    }
    static wrongPassword() {
        return {
            name: "WRONG_PASSWORD",
            code: errorEnum.WRONG_PASSWORD,
            httpCode: 400
        };
    }
    static emailRegisteredAlready() {
        return {
            name: "EMAIL_REGISTERED_ALREADY",
            code: errorEnum.EMAIL_REGISTERED_ALREADY,
            httpCode: 403
        };
    }
}
