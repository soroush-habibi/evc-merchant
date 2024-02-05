import Joi from "joi";
export const userDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(/^09[0-9]{9}$/)).message("invalid phone number").required()
});
