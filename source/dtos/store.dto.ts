import Joi from "joi";
import { productOrderEnum } from "../enum/productOrder.enum.js";

//*searchProduct
const searchProductDto = Joi.object({
    text: Joi.string().min(1),
    category: Joi.string().required(),                                   //todo:i need category enum
    order: Joi.string().valid(...Object.values(productOrderEnum)).required()
});

type searchProductDtoType = {
    text?: string,
    category: string,
    order: string
}

export { searchProductDto, searchProductDtoType }