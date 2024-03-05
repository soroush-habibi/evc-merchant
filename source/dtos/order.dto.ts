import Joi from "joi";
import mongoose, { Types } from "mongoose";

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

//*confirmCallback
const confirmCallbackDto = Joi.object({
    timestamp: Joi.string().pattern(new RegExp(timestampRegex)).message("invalid timestamp").required(),
    token: Joi.string().uuid().required()
});

type confirmCallbackDtoType = {
    timestamp: string,
    token: string
}

export { confirmCallbackDto, confirmCallbackDtoType }

//*getUserOrder
const getUserOrderDto = Joi.object({
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

type getUserOrderDtoType = {
    userId: string,
    orderId: string
}

export { getUserOrderDto, getUserOrderDtoType }

//*getUserOrders
const getUserOrdersDto = Joi.object({
    userId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    page: Joi.number().integer().min(1)
});

type getUserOrdersDtoType = {
    userId?: string,
    page?: number
}

export { getUserOrdersDto, getUserOrdersDtoType }