import Joi from "joi";
import { Types } from "mongoose"
import { productCategoryEnum } from "../enum/productCategory.enum.js";

const sizeRegex = /^\d+-\d+-\d+$/;

//*addProduct
const addProductDto = Joi.object({
    category: Joi.string().valid(...Object.values(productCategoryEnum)).required(),
    sub: Joi.string().required(),
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

type addProductDtoType = {
    category: productCategoryEnum,
    sub: string,
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
            return helpers.error('invalid objectId');
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

type addPhotoDtoType = {
    photo: object[],
    productId: string
}

export { addPhotoDto, addPhotoDtoType }

//*getMerchantProducts
const getMerchantProductsDto = Joi.object({
    page: Joi.number().integer().min(1),
    title: Joi.string(),
    category: Joi.string().valid(...Object.values(productCategoryEnum)),
    sub: Joi.string(),
    mode: Joi.number().valid(1, 2)                                  //* 1=merchant products 2=all verified products
}).custom((value, helpers) => {
    const { category, sub } = value;
    if ((category && !sub) || (category && sub) || (!category && !sub)) {
        return value;
    } else {
        return helpers.error('you can not pass the sub without category');
    }
}, 'properties consistency');

type getMerchantProductsDtoType = {
    page?: number,
    title?: string,
    category?: productCategoryEnum,
    sub?: string,
    mode?: number
}

export { getMerchantProductsDto, getMerchantProductsDtoType }