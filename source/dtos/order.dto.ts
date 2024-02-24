import Joi from "joi";
import mongoose, { Types } from "mongoose";

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

type addToCartDtoType = {
    userId: string,
    inventoryId: mongoose.Schema.Types.ObjectId,
    count: number
}

export { addToCartDto, addToCartDtoType }

//*getCarts
const getCartsDto = Joi.object({
    userId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});

type getCartsDtoType = {
    userId: string
}

export { getCartsDto, getCartsDtoType }

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

type confirmOrderDtoType = {
    userId: string,
    orderId: string
}

export { confirmOrderDto, confirmOrderDtoType }