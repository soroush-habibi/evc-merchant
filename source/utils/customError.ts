export interface errorType {
    name: string,
    code: number,
    httpCode: number,
    message?: string
}

export enum errorEnum {
    INTERNAL_ERROR = 9999,
    ENV = 101, INVALID_MOBILE = 102
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
}