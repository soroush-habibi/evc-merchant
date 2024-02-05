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
    AUTH_ERROR = 103
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
}