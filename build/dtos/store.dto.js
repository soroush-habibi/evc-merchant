import Joi from "joi";
import { productOrderEnum } from "../enum/productOrder.enum.js";
//*searchProduct
const searchProductDto = Joi.object({
    text: Joi.string().min(1),
    category: Joi.string().required(),
    order: Joi.string().valid(...Object.values(productOrderEnum)).required()
});
export { searchProductDto };
