import Joi from "joi";
import { Types } from "mongoose";
const timestampRegex = /^\d{10,13}$/;
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
    }, "validate objectId").required(),
    orderId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});
export { confirmOrderDto };
//*confirmCallback
const confirmCallbackDto = Joi.object({
    timestamp: Joi.string().pattern(new RegExp(timestampRegex)).message("invalid timestamp").required(),
    token: Joi.string().uuid().required()
});
export { confirmCallbackDto };
