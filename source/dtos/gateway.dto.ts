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