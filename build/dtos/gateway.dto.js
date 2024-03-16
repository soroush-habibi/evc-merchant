import Joi from "joi";
import { Types } from "mongoose";
//*createGateway
const createGatewayDto = Joi.object({
    amount: Joi.number().integer().min(10000).required(),
    callback: Joi.string().uri()
});
export { createGatewayDto };
//*getGateway
const getGatewayDto = Joi.object({
    gatewayId: Joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error('invalid objectId');
        }
        return value;
    }, "validate objectId").required()
});
export { getGatewayDto };
