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