import Joi from "joi";
import { Types } from "mongoose"

const sizeRegex = /^\d+-\d+-\d+$/;

//*addProduct
const addProductDto = Joi.object({
    category: Joi.string().required(),          //todo:validation?
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

type addProductDtoType = {
    category: string,
    original: boolean,
    size: string,
    weight: number,
    title: string,
    photo?: object[],
    addData?: object
}

export { addProductDto, addProductDtoType }

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

type deletePhotoDtoType = {
    uuid: string,
    productId: string
}

export { deletePhotoDto, deletePhotoDtoType }

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

type addPhotoDtoType = {
    photo: object[],
    productId: string
}

export { addPhotoDto, addPhotoDtoType }

//*getMerchantProducts
const getMerchantProductsDto = Joi.object({
    page: Joi.number().integer(),
    title: Joi.string(),
    category: Joi.string(),                                         //todo:add validation
    mode: Joi.number().valid(1, 2)                                  //* 1=merchant products 2=all verified products
});

type getMerchantProductsDtoType = {
    page?: number,
    title?: string,
    category?: string,
    mode?: number
}

export { getMerchantProductsDto, getMerchantProductsDtoType }