import Joi from "joi";
import { Types } from "mongoose";
//*addToCart
const addToCartDto = Joi.object({
    userId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    inventoryId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    count: Joi.number().integer().min(0).required()
});
export { addToCartDto };
//*getCarts
const getCartsDto = Joi.object({
    userId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});
export { getCartsDto };
//*confirmOrder
const confirmOrderDto = Joi.object({
    userId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});
export { confirmOrderDto };
