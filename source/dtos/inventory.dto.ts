import Joi from "joi";
import { Types } from "mongoose"

//*addInventory
const addInventoryDto = Joi.object({
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    price: Joi.number().integer().min(10000),
    count: Joi.number().integer().min(0).required()
});

type addInventoryDtoType = {
    productId: string,
    price?: number,
    count: number,
}

export { addInventoryDto, addInventoryDtoType }

//*getProductInventory
const getProductInventoryDto = Joi.object({
    page: Joi.number().integer(),
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
});

type getProductInventoryDtoType = {
    productId?: string,
    page?: number,
}

export { getProductInventoryDto, getProductInventoryDtoType }

//*getMerchantInventory
const getMerchantInventoryDto = Joi.object({
    page: Joi.number().integer()
});

type getMerchantInventoryDtoType = {
    page?: number,
}

export { getMerchantInventoryDto, getMerchantInventoryDtoType }