import Joi from "joi";
import { Types } from "mongoose";
import { productStatusEnum } from "../enum/productStatus.enum.js";
import { documentStatusEnum } from "../enum/documentStatus.enum.js";
const phoneRegex = /^09[0-9]{9}$/;
const nationalCodeRegex = /^\d{3}\d{6}\d{1}$/;
//*getAdminProducts
const getAdminProductsDto = Joi.object({
    page: Joi.number().integer().min(1),
    title: Joi.string(),
    category: Joi.string(),
    status: Joi.string().valid(...Object.values(productStatusEnum))
});
export { getAdminProductsDto };
//*verifyProduct
const updateProductStatusDto = Joi.object({
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    newStatus: Joi.string().valid(...Object.values(productStatusEnum)).required()
});
export { updateProductStatusDto };
//*getUsers
const getUsersDto = Joi.object({
    page: Joi.number().integer().min(1),
    phoneNumber: Joi.string(),
    fullName: Joi.string(),
    nationalCode: Joi.string(),
});
export { getUsersDto };
//*checkDocument
const checkDocumentDto = Joi.object({
    documentId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    newStatus: Joi.string().valid(...Object.values(documentStatusEnum)).required(),
    message: Joi.string()
});
export { checkDocumentDto };
