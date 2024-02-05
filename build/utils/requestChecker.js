import { CustomErrorClass } from "./customError.js";
export var FieldType;
(function (FieldType) {
    FieldType["QUERY"] = "query";
    FieldType["BODY"] = "body";
})(FieldType = FieldType || (FieldType = {}));
export const genericValidator = (templateObj, fieldType = FieldType.BODY) => {
    return (req, res, next) => {
        try {
            const dataToBeValidate = req[fieldType];
            const validate = templateObj.validate(dataToBeValidate);
            if (validate.error)
                throw validate.error;
            next();
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
