import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from 'joi';
import { CustomErrorClass } from "./customError.js";
import Formidable from "formidable";
import { isObject } from "class-validator";
import { PersistentFile } from "formidable";

export enum FieldType {
    "QUERY" = "query",
    "BODY" = "body",
    "form" = "FORM"
}

export const genericValidator = (templateObj: ObjectSchema<any>, fieldType: FieldType = FieldType.BODY) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (fieldType === FieldType.form) {
                const formidable = Formidable({ multiples: true, maxFileSize: 8 * 1024 * 1024 });
                const [fields, files] = await formidable.parse(req);
                const data = Object.assign(fields, files);

                for (const key in data) {
                    if (Array.isArray(data[key]) && !((data as any)[key][0] instanceof PersistentFile)) {
                        (data as any)[key] = (data[key] as string[])[0];
                    }

                    try {
                        const object = JSON.parse(String(data[key]));
                        (data as any)[key] = object;
                    } catch (e) { }
                }

                const validate = templateObj.validate(data);

                if (validate.error) throw validate.error

                req.form = data;

                next();
            } else {
                const dataToBeValidate = req[fieldType];

                const validate = templateObj.validate(dataToBeValidate);

                if (validate.error) throw validate.error

                next();
            }
        } catch (e: any) {
            if (typeof (e._original) === 'object') {
                const message = [];
                for (let i of e.details) {
                    message.push({
                        message: i.message
                    })
                }
                return next(CustomErrorClass.joiError(message));
            } else {
                return next(CustomErrorClass.internalError());
            }
        }
    }
}; 