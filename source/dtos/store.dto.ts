import Joi from "joi";
import { productOrderEnum } from "../enum/productOrder.enum.js";
import { Types } from "mongoose";

//*searchProduct
const searchProductDto = Joi.object({
    text: Joi.string().min(1),
    category: Joi.string().required(),                                   //todo:i need category enum
    order: Joi.string().valid(...Object.values(productOrderEnum)).required(),
    page: Joi.number()
});

type searchProductDtoType = {
    text?: string,
    category: string,
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