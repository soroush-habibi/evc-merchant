import Joi from "joi";
import { Types } from "mongoose";
const sizeRegex = /^\d+-\d+-\d+$/;
//*addProduct
const addProductDto = Joi.object({
    category: Joi.string().required(),
    original: Joi.boolean().required(),
    size: Joi.string().pattern(sizeRegex).message("invalid size format. it should be d-d-d").required(),
    weight: Joi.number().required(),
    title: Joi.string().min(5).required(),
    photo: Joi.array().max(20).items(Joi.object({
        originalFilename: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().required(),
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
            return helpers.error('any.invalid');
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
        size: Joi.number().required(),
        filepath: Joi.string().required(),
    }).unknown(true)).required(),
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }, "validate objectId").required()
});
export { addPhotoDto };
