import Joi from "joi";
import { Types } from "mongoose";

//*createGateway
const createGatewayDto = Joi.object({
    amount: Joi.number().integer().min(10000).required(),
    callback: Joi.string().uri()
});

type createGatewayDtoType = {
    amount: number,
    callback?: string
}

export { createGatewayDto, createGatewayDtoType }

//*getGateway
const getGatewayDto = Joi.object({
    gatewayId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});

type getGatewayDtoType = {
    gatewayId: string
}

export { getGatewayDto, getGatewayDtoType }

//*startPayment
const startPaymentDto = Joi.object({
    gatewayId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});

type startPaymentDtoType = {
    gatewayId: string
}

export { startPaymentDto, startPaymentDtoType }

//*verifyPayment
const verifyPaymentDto = Joi.object({
    gatewayId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    status: Joi.string().valid("canceled", "finished").required()
});

type verifyPaymentDtoType = {
    gatewayId: string,
    status: string
}

export { verifyPaymentDto, verifyPaymentDtoType }