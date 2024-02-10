import { Request, Response, NextFunction } from "express";
import { CustomErrorClass, errorEnum, errorType } from "../utils/customError.js";
import logger from "../utils/logger.js";

function errorHandler(err: errorType | Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Error) {
        if (err.name === "MongoServerError") {
            if (err.message.includes("E11000")) {
                const cerr = CustomErrorClass.mongoDuplicate();
                res.status(cerr.httpCode).json({
                    name: cerr.name,
                    code: cerr.code,
                    message: cerr.message
                });
            } else {
                logger(err);
                res.status(500).json({
                    name: "INTERNAL ERROR",
                    code: errorEnum.INTERNAL_ERROR
                });
            }
        } else {
            logger(err);
            res.status(500).json({
                name: "INTERNAL ERROR",
                code: errorEnum.INTERNAL_ERROR
            });
        }
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