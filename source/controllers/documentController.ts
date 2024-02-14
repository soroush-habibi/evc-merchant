import { NextFunction, Request, Response } from "express";
import { CustomErrorClass } from "../utils/customError.js";
import { sendDocumentDtoType } from "../dtos/document.dto.js";

const ENV = process.env.PRODUCTION

export default class documentController {
    static sendDocument(req: Request, res: Response, next: NextFunction) {
        const body = req.form as sendDocumentDtoType;

        try {

        } catch (e) {
            return next(e);
        }
    }
}