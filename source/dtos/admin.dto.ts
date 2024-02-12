import Joi from "joi";
import { Types } from "mongoose";
import { productStatusEnum } from "../enum/productStatus.enum.js";

//*getAdminProducts
const getAdminProductsDto = Joi.object({
    page: Joi.number().integer(),
    title: Joi.string(),
    category: Joi.string(),                             //todo:add validation
    status: Joi.string().valid(...Object.values(productStatusEnum))
});

type getAdminProductsDtoType = {
    page?: number,
    title?: string,
    category?: string,
    status?: productStatusEnum
}

export { getAdminProductsDto, getAdminProductsDtoType }

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

type updateProductStatusDtoType = {
    productId: string,
    newStatus: productStatusEnum
}

export { updateProductStatusDto, updateProductStatusDtoType }