import Joi from "joi";
import { Types } from "mongoose";

//*addComment
const addCommentDto = Joi.object({
    inventoryId: Joi.string().custom((value, helpers) => {
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
    }, "validate objectId").required(),
    title: Joi.string().required().min(3),
    context: Joi.string().required().min(3),
    pros: Joi.array().items(Joi.string().min(3)).default([]),
    cons: Joi.array().items(Joi.string().min(3)).default([]),
    rate: Joi.number().min(1).max(5).required(),
    suggest: Joi.boolean().required()
});

type addCommentDtoType = {
    inventoryId: string,
    orderId: string,
    title: string,
    context: string,
    pros: string[],
    cons: string[],
    rate: number,
    suggest: boolean
}

export { addCommentDto, addCommentDtoType }

//*deleteComment
const deleteCommentDto = Joi.object({
    commentId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    userId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
});

type deleteCommentDtoType = {
    commentId: string,
    userId: string
}

export { deleteCommentDto, deleteCommentDtoType }

//*getProductComments
const getProductCommentsDto = Joi.object({
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    page: Joi.number().integer().min(1),
});

type getProductCommentsDtoType = {
    page?: number,
    productId?: string
}

export { getProductCommentsDto, getProductCommentsDtoType }

//*getProductStats
const getProductStatsDto = Joi.object({
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});

type getProductStatsDtoType = {
    productId: string
}

export { getProductStatsDto, getProductStatsDtoType }

//*getMerchantStats
const getMerchantStatsDto = Joi.object({
    merchantId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});

type getMerchantStatsDtoType = {
    merchantId: string
}

export { getMerchantStatsDto, getMerchantStatsDtoType }