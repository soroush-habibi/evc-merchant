export interface errorType {
    name: string,
    code: number,
    httpCode: number,
    message?: string
}

export enum errorEnum {
    INTERNAL_ERROR = 9999,
    BAD_REQUEST = 400,
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
    PRODUCT_PHOTO_NOT_FOUND = 113,
    PRODUCT_MAX_PHOTO = 114,
    INVENTORY_SUSPENDED = 115,
    STORE_NOT_FOUND = 116,
    PENDING_DOCUMENT = 117,
    DOCUMENT_NOT_FOUND = 118,
    DUPLICATE_NOTIF_PHONE = 119,
    INVENTORY_NOT_FOUND = 120,
    INSUFFICIENT_INVENTORY = 121,
    PAYMENT_NOT_FOUND = 122,
    ORDER_NOT_FOUND = 123,
    ADDRESS_NOT_FOUND = 124,
    USER_NOT_VERIFIED = 125,
    FEE_REQUIRED = 126,
    CATEGORY_NOT_FOUND = 127,
    STORE_NOT_VERIFIED = 128,
    ORDER_NOT_RECEIVED = 129,
    NO_MATCH = 130,
    TIMEOUT = 131,
    COMMENT_NOT_FOUND = 132,
    EVC_AUTH_ERROR = 133,
    GATEWAY_NOT_FOUND = 134,
    FORBIDDEN = 135,
    GATEWAY_FINISHED = 136,
    GATEWAY_PAYMENT_NOT_FOUND = 137
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
            httpCode: 401
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

    static productMaxPhoto(): errorType {
        return {
            name: "PRODUCT_MAX_PHOTO",
            code: errorEnum.PRODUCT_MAX_PHOTO,
            httpCode: 400
        };
    }

    static inventorySuspended(): errorType {
        return {
            name: "INVENTORY_SUSPENDED",
            code: errorEnum.INVENTORY_SUSPENDED,
            httpCode: 403
        };
    }

    static storeNotFound(): errorType {
        return {
            name: "STORE_NOT_FOUND",
            code: errorEnum.STORE_NOT_FOUND,
            httpCode: 404
        };
    }

    static pendingDocument(): errorType {
        return {
            name: "PENDING_DOCUMENT",
            code: errorEnum.PENDING_DOCUMENT,
            httpCode: 400
        };
    }

    static documentNotFound(): errorType {
        return {
            name: "DOCUMENT_NOT_FOUND",
            code: errorEnum.DOCUMENT_NOT_FOUND,
            httpCode: 404
        };
    }

    static duplicateNotifPhone(): errorType {
        return {
            name: "DUPLICATE_NOTIF_PHONE",
            code: errorEnum.DUPLICATE_NOTIF_PHONE,
            httpCode: 400
        };
    }

    static badRequest(): errorType {
        return {
            name: "BAD_REQUEST",
            code: errorEnum.BAD_REQUEST,
            httpCode: 400
        };
    }

    static inventoryNotFound(): errorType {
        return {
            name: "INVENTORY_NOT_FOUND",
            code: errorEnum.INVENTORY_NOT_FOUND,
            httpCode: 404
        };
    }

    static insufficientInventory(): errorType {
        return {
            name: "INSUFFICIENT_INVENTORY",
            code: errorEnum.INSUFFICIENT_INVENTORY,
            httpCode: 400
        };
    }

    static paymentNotFound(): errorType {
        return {
            name: "PAYMENT_NOT_FOUND",
            code: errorEnum.PAYMENT_NOT_FOUND,
            httpCode: 404
        };
    }

    static orderNotFound(): errorType {
        return {
            name: "ORDER_NOT_FOUND",
            code: errorEnum.ORDER_NOT_FOUND,
            httpCode: 404
        };
    }

    static addressNotFound(): errorType {
        return {
            name: "ADDRESS_NOT_FOUND",
            code: errorEnum.ADDRESS_NOT_FOUND,
            httpCode: 404
        };
    }

    static userNotVerified(): errorType {
        return {
            name: "USER_NOT_VERIFIED",
            code: errorEnum.USER_NOT_VERIFIED,
            httpCode: 403
        };
    }

    static feeRequired(): errorType {
        return {
            name: "FEE_REQUIRED",
            code: errorEnum.FEE_REQUIRED,
            httpCode: 400
        };
    }

    static categoryNotFound(): errorType {
        return {
            name: "CATEGORY_NOT_FOUND",
            code: errorEnum.CATEGORY_NOT_FOUND,
            httpCode: 404
        };
    }

    static storeNotVerified(): errorType {
        return {
            name: "STORE_NOT_VERIFIED",
            code: errorEnum.STORE_NOT_VERIFIED,
            httpCode: 403
        };
    }

    static orderNotReceived(): errorType {
        return {
            name: "ORDER_NOT_RECEIVED",
            code: errorEnum.ORDER_NOT_RECEIVED,
            httpCode: 403
        };
    }

    static noMatch(): errorType {
        return {
            name: "NO_MATCH",
            code: errorEnum.NO_MATCH,
            httpCode: 400
        };
    }

    static timeout(): errorType {
        return {
            name: "TIMEOUT",
            code: errorEnum.TIMEOUT,
            httpCode: 400
        };
    }

    static commentNotFound(): errorType {
        return {
            name: "COMMENT_NOT_FOUND",
            code: errorEnum.COMMENT_NOT_FOUND,
            httpCode: 404
        };
    }

    static evcAuthError(): errorType {
        return {
            name: "EVC_AUTH_ERROR",
            code: errorEnum.EVC_AUTH_ERROR,
            httpCode: 400
        };
    }

    static gatewayNotFound(): errorType {
        return {
            name: "GATEWAY_NOT_FOUND",
            code: errorEnum.GATEWAY_NOT_FOUND,
            httpCode: 404
        };
    }

    static forbidden(): errorType {
        return {
            name: "FORBIDDEN",
            code: errorEnum.FORBIDDEN,
            httpCode: 403
        };
    }

    static gatewayFinished(): errorType {
        return {
            name: "GATEWAY_FINISHED",
            code: errorEnum.GATEWAY_FINISHED,
            httpCode: 400
        };
    }

    static gatewayPaymentNotFound(): errorType {
        return {
            name: "GATEWAY_PAYMENT_NOT_FOUND",
            code: errorEnum.GATEWAY_PAYMENT_NOT_FOUND,
            httpCode: 404
        };
    }
}