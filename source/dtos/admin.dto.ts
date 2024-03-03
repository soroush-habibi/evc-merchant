import Joi from "joi";
import { Types } from "mongoose";
import { productStatusEnum } from "../enum/productStatus.enum.js";
import { documentStatusEnum } from "../enum/documentStatus.enum.js";
import { userStatusEnum } from "../enum/userStatus.enum.js";

const phoneRegex = /^09[0-9]{9}$/;
const nationalCodeRegex = /^\d{3}\d{6}\d{1}$/;

//*getAdminProducts
const getAdminProductsDto = Joi.object({
    page: Joi.number().integer().min(1),
    title: Joi.string(),
    category: Joi.string(),                             //todo:add validation
    status: Joi.string().valid(...Object.values(productStatusEnum))
});

type getAdminProductsDtoType = {
    page?: number,
    title?: string,
    category?: string,
    status?: productStatusEnum
}

export { getAdminProductsDto, getAdminProductsDtoType }

//*verifyProduct
const updateProductStatusDto = Joi.object({
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    newStatus: Joi.string().valid(...Object.values(productStatusEnum)).required(),
    newSub: Joi.string(),
    wage: Joi.number().min(0).max(100)
});

type updateProductStatusDtoType = {
    productId: string,
    newStatus: productStatusEnum,
    newSub?: string,
    wage?: string
}

export { updateProductStatusDto, updateProductStatusDtoType }

//*getUsers
const getUsersDto = Joi.object({
    page: Joi.number().integer().min(1),
    phoneNumber: Joi.string(),
    fullName: Joi.string(),
    nationalCode: Joi.string(),
});

type getUsersDtoType = {
    page?: number,
    phoneNumber?: string,
    fullName?: string,
    nationalCode?: string
}

export { getUsersDto, getUsersDtoType }

//*verifyUser
const verifyUserDto = Joi.object({
    phoneNumber: Joi.string().required(),
    newStatus: Joi.string().valid(...Object.values(userStatusEnum)).required(),
    message: Joi.string()
});

type verifyUserDtoType = {
    phoneNumber: string,
    newStatus: userStatusEnum,
    message?: string
}

export { verifyUserDto, verifyUserDtoType }

//*checkDocument
const checkDocumentDto = Joi.object({
    documentId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    newStatus: Joi.string().valid(...Object.values(documentStatusEnum)).required(),
    message: Joi.string()
});

type checkDocumentDtoType = {
    documentId: string,
    newStatus: documentStatusEnum,
    message?: string
}

export { checkDocumentDto, checkDocumentDtoType }