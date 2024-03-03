import Joi from "joi";
import { productOrderEnum } from "../enum/productOrder.enum.js";
import { Types } from "mongoose";
import { productCategoryEnum } from "../enum/productCategory.enum.js";

//*searchProduct
const searchProductDto = Joi.object({
    text: Joi.string().min(1),
    category: Joi.string().valid(...Object.values(productCategoryEnum)),
    sub: Joi.string(),
    order: Joi.string().valid(...Object.values(productOrderEnum)).required(),
    page: Joi.number()
}).custom((value, helpers) => {
    const { category, sub } = value;
    if ((category && !sub) || (category && sub) || (!category && !sub)) {
        return value;
    } else {
        return helpers.error('you can not pass the sub without category');
    }
}, 'properties consistency');;

type searchProductDtoType = {
    text?: string,
    category?: string,
    sub?: string,
    order: string,
    page?: any
}

export { searchProductDto, searchProductDtoType }

//*getProduct
const getProductDto = Joi.object({
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});

type getProductDtoType = {
    productId: string
}

export { getProductDto, getProductDtoType }