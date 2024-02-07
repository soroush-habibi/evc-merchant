import Joi, { number } from "joi";
import { statesEnum } from "../enum/states.enum.js";

const phoneRegex = /^09[0-9]{9}$/;
const latitudeRegex = /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/;
const longitudeRegex = /^-?((1?[0-7]?|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/;
const postcodeRegex = /^\d{10}$/;

//*preRegister
const preRegisterDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
});

type preRegisterDtoType = {
    phoneNumber: string
}

export { preRegisterDto, preRegisterDtoType }

//*register

const registerDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    otp: Joi.string().required().min(6).max(6),
    fullName: Joi.string().required().min(2),
    password: Joi.string().required().min(4)
});

type registerDtoType = {
    phoneNumber: string,
    otp: string,
    fullName: string,
    password: string
}

export { registerDto, registerDtoType }

//*login
const loginDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    otp: Joi.string().min(6).max(6),
    password: Joi.string().min(4),
}).xor("otp", "password");

type loginDtoType = {
    phoneNumber: string,
    otp?: string,
    password?: string
}

export { loginDto, loginDtoType }

//*preRegisterEmail
const preRegisterEmailDto = Joi.object({
    email: Joi.string().email().required()
});

type preRegisterEmailDtoType = {
    email: string
}

export { preRegisterEmailDto, preRegisterEmailDtoType }

//*registerEmail
const registerEmailDto = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().min(6).max(6).required()
});

type registerEmailDtoType = {
    email: string,
    otp: string
}

export { registerEmailDto, registerEmailDtoType }

//*registerAddress
const registerAddressDto = Joi.object({
    longitude: Joi.string().pattern(new RegExp(longitudeRegex)).message("invalid longitude").required(),
    latitude: Joi.string().pattern(new RegExp(latitudeRegex)).message("invalid latitude").required(),
    state: Joi.string().valid(...Object.values(statesEnum)).required(),
    city: Joi.string().required(),                                              //todo:add validation
    address: Joi.string().required(),
    number: Joi.number().min(0),
    postCode: Joi.string().pattern(new RegExp(postcodeRegex)).message("invalid post code").required()
});

type registerAddressDtoType = {
    longitude: string,
    latitude: string,
    state: statesEnum,
    city: string,
    address: string,
    number?: number,
    postCode: string
}

export { registerAddressDto, registerAddressDtoType }

//*getUserAddresses
const getUserAddressesDto = Joi.object({
    page: Joi.number()
});

type getUserAddressesDtoType = {
    page: string
}

export { getUserAddressesDto, getUserAddressesDtoType }