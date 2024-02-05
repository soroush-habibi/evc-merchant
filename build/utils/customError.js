export var errorEnum;
(function (errorEnum) {
    errorEnum[errorEnum["INTERNAL_ERROR"] = 9999] = "INTERNAL_ERROR";
    errorEnum[errorEnum["ENV"] = 101] = "ENV";
    errorEnum[errorEnum["JOI_ERROR"] = 102] = "JOI_ERROR";
    errorEnum[errorEnum["AUTH_ERROR"] = 103] = "AUTH_ERROR";
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
}
