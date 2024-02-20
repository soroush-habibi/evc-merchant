import { CustomErrorClass } from "./customError.js";
import Formidable from "formidable";
import { PersistentFile } from "formidable";
export var FieldType;
(function (FieldType) {
    FieldType["QUERY"] = "query";
    FieldType["BODY"] = "body";
    FieldType["FORM"] = "form";
    FieldType["PARAMS"] = "params";
})(FieldType = FieldType || (FieldType = {}));
export const genericValidator = (templateObj, fieldType = FieldType.BODY) => {
    return async (req, res, next) => {
        try {
            if (fieldType === FieldType.FORM) {
                const formidable = Formidable({ multiples: true, maxFileSize: (Number(process.env.MAX_DOC_SIZE) || 20) * 1024 * 1024 });
                const [fields, files] = await formidable.parse(req);
                const data = Object.assign(fields, files);
                for (const key in data) {
                    if (Array.isArray(data[key]) && !(data[key][0] instanceof PersistentFile)) {
                        data[key] = data[key][0];
                    }
                    try {
                        const object = JSON.parse(String(data[key]));
                        data[key] = object;
                    }
                    catch (e) { }
                }
                const validate = templateObj.validate(data);
                if (validate.error)
                    throw validate.error;
                req.form = data;
                next();
            }
            else {
                const dataToBeValidate = req[fieldType];
                const validate = templateObj.validate(dataToBeValidate);
                if (validate.error)
                    throw validate.error;
                next();
            }
        }
        catch (e) {
            if (typeof (e._original) === 'object') {
                const message = [];
                for (let i of e.details) {
                    message.push({
                        message: i.message
                    });
                }
                return next(CustomErrorClass.joiError(message));
            }
            else {
                return next(CustomErrorClass.internalError());
            }
        }
    };
};
