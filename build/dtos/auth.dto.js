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
//*login
const loginDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    otp: Joi.string().min(6).max(6),
    password: Joi.string().min(4),
}).xor("otp", "password");
export { loginDto };
//*preRegisterEmail
const preRegisterEmailDto = Joi.object({
    email: Joi.string().email().required()
});
export { preRegisterEmailDto };
//*registerEmail
const registerEmailDto = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().min(6).max(6).required()
});
export { registerEmailDto };
