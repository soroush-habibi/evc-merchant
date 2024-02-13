import Joi from "joi";
import { Types } from "mongoose";
//*addInventory
const addInventoryDto = Joi.object({
    productId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required(),
    price: Joi.number().integer().min(10000).required(),
    count: Joi.number().integer().min(1).required()
});
export { addInventoryDto };
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
export { getProductInventoryDto };
//*getMerchantInventory
const getMerchantInventoryDto = Joi.object({
    page: Joi.number().integer()
});
export { getMerchantInventoryDto };
