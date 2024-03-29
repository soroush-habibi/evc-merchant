export var errorEnum;
(function (errorEnum) {
    errorEnum[errorEnum["INTERNAL_ERROR"] = 9999] = "INTERNAL_ERROR";
    errorEnum[errorEnum["BAD_REQUEST"] = 400] = "BAD_REQUEST";
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
    errorEnum[errorEnum["MONGO_DUPLICATE"] = 111] = "MONGO_DUPLICATE";
    errorEnum[errorEnum["PRODUCT_NOT_FOUND"] = 112] = "PRODUCT_NOT_FOUND";
    errorEnum[errorEnum["PRODUCT_PHOTO_NOT_FOUND"] = 113] = "PRODUCT_PHOTO_NOT_FOUND";
    errorEnum[errorEnum["PRODUCT_MAX_PHOTO"] = 114] = "PRODUCT_MAX_PHOTO";
    errorEnum[errorEnum["INVENTORY_SUSPENDED"] = 115] = "INVENTORY_SUSPENDED";
    errorEnum[errorEnum["STORE_NOT_FOUND"] = 116] = "STORE_NOT_FOUND";
    errorEnum[errorEnum["PENDING_DOCUMENT"] = 117] = "PENDING_DOCUMENT";
    errorEnum[errorEnum["DOCUMENT_NOT_FOUND"] = 118] = "DOCUMENT_NOT_FOUND";
    errorEnum[errorEnum["DUPLICATE_NOTIF_PHONE"] = 119] = "DUPLICATE_NOTIF_PHONE";
    errorEnum[errorEnum["INVENTORY_NOT_FOUND"] = 120] = "INVENTORY_NOT_FOUND";
    errorEnum[errorEnum["INSUFFICIENT_INVENTORY"] = 121] = "INSUFFICIENT_INVENTORY";
    errorEnum[errorEnum["PAYMENT_NOT_FOUND"] = 122] = "PAYMENT_NOT_FOUND";
    errorEnum[errorEnum["ORDER_NOT_FOUND"] = 123] = "ORDER_NOT_FOUND";
    errorEnum[errorEnum["ADDRESS_NOT_FOUND"] = 124] = "ADDRESS_NOT_FOUND";
    errorEnum[errorEnum["USER_NOT_VERIFIED"] = 125] = "USER_NOT_VERIFIED";
    errorEnum[errorEnum["FEE_REQUIRED"] = 126] = "FEE_REQUIRED";
    errorEnum[errorEnum["CATEGORY_NOT_FOUND"] = 127] = "CATEGORY_NOT_FOUND";
    errorEnum[errorEnum["STORE_NOT_VERIFIED"] = 128] = "STORE_NOT_VERIFIED";
    errorEnum[errorEnum["ORDER_NOT_RECEIVED"] = 129] = "ORDER_NOT_RECEIVED";
    errorEnum[errorEnum["NO_MATCH"] = 130] = "NO_MATCH";
    errorEnum[errorEnum["TIMEOUT"] = 131] = "TIMEOUT";
    errorEnum[errorEnum["COMMENT_NOT_FOUND"] = 132] = "COMMENT_NOT_FOUND";
    errorEnum[errorEnum["EVC_AUTH_ERROR"] = 133] = "EVC_AUTH_ERROR";
    errorEnum[errorEnum["GATEWAY_NOT_FOUND"] = 134] = "GATEWAY_NOT_FOUND";
    errorEnum[errorEnum["FORBIDDEN"] = 135] = "FORBIDDEN";
    errorEnum[errorEnum["GATEWAY_FINISHED"] = 136] = "GATEWAY_FINISHED";
    errorEnum[errorEnum["GATEWAY_PAYMENT_NOT_FOUND"] = 137] = "GATEWAY_PAYMENT_NOT_FOUND";
    errorEnum[errorEnum["PAYMENT_EXISTS"] = 138] = "PAYMENT_EXISTS";
})(errorEnum || (errorEnum = {}));
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
            httpCode: 401
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
    static mongoDuplicate() {
        return {
            name: "MONGO_DUPLICATE",
            code: errorEnum.MONGO_DUPLICATE,
            httpCode: 400
        };
    }
    static productNotFound() {
        return {
            name: "PRODUCT_NOT_FOUND",
            code: errorEnum.PRODUCT_NOT_FOUND,
            httpCode: 404
        };
    }
    static productPhotoNotFound() {
        return {
            name: "PRODUCT_PHOTO_NOT_FOUND",
            code: errorEnum.PRODUCT_PHOTO_NOT_FOUND,
            httpCode: 404
        };
    }
    static productMaxPhoto() {
        return {
            name: "PRODUCT_MAX_PHOTO",
            code: errorEnum.PRODUCT_MAX_PHOTO,
            httpCode: 400
        };
    }
    static inventorySuspended() {
        return {
            name: "INVENTORY_SUSPENDED",
            code: errorEnum.INVENTORY_SUSPENDED,
            httpCode: 403
        };
    }
    static storeNotFound() {
        return {
            name: "STORE_NOT_FOUND",
            code: errorEnum.STORE_NOT_FOUND,
            httpCode: 404
        };
    }
    static pendingDocument() {
        return {
            name: "PENDING_DOCUMENT",
            code: errorEnum.PENDING_DOCUMENT,
            httpCode: 400
        };
    }
    static documentNotFound() {
        return {
            name: "DOCUMENT_NOT_FOUND",
            code: errorEnum.DOCUMENT_NOT_FOUND,
            httpCode: 404
        };
    }
    static duplicateNotifPhone() {
        return {
            name: "DUPLICATE_NOTIF_PHONE",
            code: errorEnum.DUPLICATE_NOTIF_PHONE,
            httpCode: 400
        };
    }
    static badRequest() {
        return {
            name: "BAD_REQUEST",
            code: errorEnum.BAD_REQUEST,
            httpCode: 400
        };
    }
    static inventoryNotFound() {
        return {
            name: "INVENTORY_NOT_FOUND",
            code: errorEnum.INVENTORY_NOT_FOUND,
            httpCode: 404
        };
    }
    static insufficientInventory() {
        return {
            name: "INSUFFICIENT_INVENTORY",
            code: errorEnum.INSUFFICIENT_INVENTORY,
            httpCode: 400
        };
    }
    static paymentNotFound() {
        return {
            name: "PAYMENT_NOT_FOUND",
            code: errorEnum.PAYMENT_NOT_FOUND,
            httpCode: 404
        };
    }
    static orderNotFound() {
        return {
            name: "ORDER_NOT_FOUND",
            code: errorEnum.ORDER_NOT_FOUND,
            httpCode: 404
        };
    }
    static addressNotFound() {
        return {
            name: "ADDRESS_NOT_FOUND",
            code: errorEnum.ADDRESS_NOT_FOUND,
            httpCode: 404
        };
    }
    static userNotVerified() {
        return {
            name: "USER_NOT_VERIFIED",
            code: errorEnum.USER_NOT_VERIFIED,
            httpCode: 403
        };
    }
    static feeRequired() {
        return {
            name: "FEE_REQUIRED",
            code: errorEnum.FEE_REQUIRED,
            httpCode: 400
        };
    }
    static categoryNotFound() {
        return {
            name: "CATEGORY_NOT_FOUND",
            code: errorEnum.CATEGORY_NOT_FOUND,
            httpCode: 404
        };
    }
    static storeNotVerified() {
        return {
            name: "STORE_NOT_VERIFIED",
            code: errorEnum.STORE_NOT_VERIFIED,
            httpCode: 403
        };
    }
    static orderNotReceived() {
        return {
            name: "ORDER_NOT_RECEIVED",
            code: errorEnum.ORDER_NOT_RECEIVED,
            httpCode: 403
        };
    }
    static noMatch() {
        return {
            name: "NO_MATCH",
            code: errorEnum.NO_MATCH,
            httpCode: 400
        };
    }
    static timeout() {
        return {
            name: "TIMEOUT",
            code: errorEnum.TIMEOUT,
            httpCode: 400
        };
    }
    static commentNotFound() {
        return {
            name: "COMMENT_NOT_FOUND",
            code: errorEnum.COMMENT_NOT_FOUND,
            httpCode: 404
        };
    }
    static evcAuthError() {
        return {
            name: "EVC_AUTH_ERROR",
            code: errorEnum.EVC_AUTH_ERROR,
            httpCode: 400
        };
    }
    static gatewayNotFound() {
        return {
            name: "GATEWAY_NOT_FOUND",
            code: errorEnum.GATEWAY_NOT_FOUND,
            httpCode: 404
        };
    }
    static forbidden() {
        return {
            name: "FORBIDDEN",
            code: errorEnum.FORBIDDEN,
            httpCode: 403
        };
    }
    static gatewayFinished() {
        return {
            name: "GATEWAY_FINISHED",
            code: errorEnum.GATEWAY_FINISHED,
            httpCode: 400
        };
    }
    static gatewayPaymentNotFound() {
        return {
            name: "GATEWAY_PAYMENT_NOT_FOUND",
            code: errorEnum.GATEWAY_PAYMENT_NOT_FOUND,
            httpCode: 404
        };
    }
    static paymentExists() {
        return {
            name: "PAYMENT_EXISTS",
            code: errorEnum.PAYMENT_EXISTS,
            httpCode: 400
        };
    }
}
