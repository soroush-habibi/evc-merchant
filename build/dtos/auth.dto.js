import Joi from "joi";
const phoneRegex = /^09[0-9]{9}$/;
//*preRegister
const preRegisterDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
});
export { preRegisterDto };
//*register
const registerDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    otp: Joi.string().required().min(6).max(6),
    fullName: Joi.string().required().min(2),
    password: Joi.string().required().min(4)
});
export { registerDto };
