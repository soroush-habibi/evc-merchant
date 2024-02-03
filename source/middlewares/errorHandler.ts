import { Request, Response, NextFunction } from "express";
import { errorEnum, errorType } from "../utils/customError.js";
import logger from "../utils/logger.js";

function errorHandler(err: errorType | Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Error) {
        logger(err);
        res.status(500).json({
            name: "INTERNAL ERROR",
            code: errorEnum.INTERNAL_ERROR
        });
    } else {
        if (err.httpCode === 500) {
            logger(err);
        }
        res.status(err.httpCode).json({
            name: err.name,
            code: err.code,
            message: err.message
        });
    }
}

export default errorHandler;