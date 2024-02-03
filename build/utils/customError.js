export var errorEnum;
(function (errorEnum) {
    errorEnum[errorEnum["INTERNAL_ERROR"] = 9999] = "INTERNAL_ERROR";
    errorEnum[errorEnum["ENV"] = 101] = "ENV";
    errorEnum[errorEnum["INVALID_MOBILE"] = 102] = "INVALID_MOBILE";
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
}
