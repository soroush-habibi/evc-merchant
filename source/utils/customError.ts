export interface errorType {
    name: string,
    code: number,
    httpCode: number,
    message?: string
}

export enum errorEnum {
    INTERNAL_ERROR = 9999,
    ENV = 101,
    JOI_ERROR = 102,
    AUTH_ERROR = 103,
    ACTIVE_OTP = 104,
    NO_OTP = 105,
    WRONG_OTP = 106,
    USER_NOT_FOUND = 107,
    ALREADY_REGISTERED = 108,
    WRONG_PASSWORD = 109,
    EMAIL_REGISTERED_ALREADY = 110,
    MONGO_DUPLICATE = 111,
    PRODUCT_NOT_FOUND = 112,
    PRODUCT_PHOTO_NOT_FOUND = 113
}

export class CustomErrorClass {
    static noEnv(varName: string): errorType {
        return {
            name: "ENV",
            code: errorEnum.ENV,
            httpCode: 500,
            message: varName
        };
    }

    static internalError(): errorType {
        return {
            name: "INTERNAL_ERROR",
            code: errorEnum.INTERNAL_ERROR,
            httpCode: 500
        };
    }

    static joiError(message: any): errorType {
        return {
            name: "JOI_ERROR",
            code: errorEnum.JOI_ERROR,
            httpCode: 400,
            message: message
        };
    }

    static authError(): errorType {
        return {
            name: "AUTH_ERROR",
            code: errorEnum.AUTH_ERROR,
            httpCode: 403
        };
    }

    static activeOtp(): errorType {
        return {
            name: "ACTIVE_OTP",
            code: errorEnum.ACTIVE_OTP,
            httpCode: 400
        };
    }

    static userNotFound(): errorType {
        return {
            name: "USER_NOT_FOUND",
            code: errorEnum.USER_NOT_FOUND,
            httpCode: 404
        };
    }

    static noOtp(): errorType {
        return {
            name: "NO_OTP",
            code: errorEnum.NO_OTP,
            httpCode: 404
        };
    }

    static wrongOtp(): errorType {
        return {
            name: "WRONG_OTP",
            code: errorEnum.WRONG_OTP,
            httpCode: 400
        };
    }

    static alreadyRegistered(): errorType {
        return {
            name: "ALREADY_REGISTERED",
            code: errorEnum.ALREADY_REGISTERED,
            httpCode: 400
        };
    }

    static wrongPassword(): errorType {
        return {
            name: "WRONG_PASSWORD",
            code: errorEnum.WRONG_PASSWORD,
            httpCode: 400
        };
    }

    static emailRegisteredAlready(): errorType {
        return {
            name: "EMAIL_REGISTERED_ALREADY",
            code: errorEnum.EMAIL_REGISTERED_ALREADY,
            httpCode: 403
        };
    }

    static mongoDuplicate(): errorType {
        return {
            name: "MONGO_DUPLICATE",
            code: errorEnum.MONGO_DUPLICATE,
            httpCode: 400
        };
    }

    static productNotFound(): errorType {
        return {
            name: "PRODUCT_NOT_FOUND",
            code: errorEnum.PRODUCT_NOT_FOUND,
            httpCode: 404
        };
    }

    static productPhotoNotFound(): errorType {
        return {
            name: "PRODUCT_PHOTO_NOT_FOUND",
            code: errorEnum.PRODUCT_PHOTO_NOT_FOUND,
            httpCode: 404
        };
    }
}