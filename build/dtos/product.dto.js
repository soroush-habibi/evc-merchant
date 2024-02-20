import Joi from "joi";
import { Types } from "mongoose";
import { productCategoryEnum } from "../enum/productCategory.enum.js";
const sizeRegex = /^\d+-\d+-\d+$/;
//*addProduct
const addProductDto = Joi.object({
    category: Joi.string().valid(...Object.values(productCategoryEnum)).required(),
    original: Joi.boolean().required(),
    size: Joi.string().pattern(sizeRegex).message("invalid size format. it should be d-d-d").required(),
    weight: Joi.number().required(),
    title: Joi.string().min(5).required(),
    photo: Joi.array().max(20).items(Joi.object({
        originalFilename: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().max(1000 * 1000 * (Number(process.env.MAX_DOC_SIZE) || 20)).required(),
        filepath: Joi.string().required(),
    }).unknown(true)),
    addData: Joi.object()
});
export { addProductDto };
//*deletePhoto
const deletePhotoDto = Joi.object({
    uuid: Joi.string().uuid().required(),
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});
export { deletePhotoDto };
//*addPhoto
const addPhotoDto = Joi.object({
    photo: Joi.array().max(20).items(Joi.object({
        originalFilename: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().max(1000 * 1000 * (Number(process.env.MAX_DOC_SIZE) || 20)).required(),
        filepath: Joi.string().required(),
    }).unknown(true)).required(),
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});
export { addPhotoDto };
//*getMerchantProducts
const getMerchantProductsDto = Joi.object({
    page: Joi.number().integer().min(1),
    title: Joi.string(),
    category: Joi.string().valid(...Object.values(productCategoryEnum)),
    mode: Joi.number().valid(1, 2) //* 1=merchant products 2=all verified products
});
export { getMerchantProductsDto };
