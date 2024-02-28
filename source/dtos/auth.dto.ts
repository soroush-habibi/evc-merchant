import Joi from "joi";
import { statesEnum } from "../enum/states.enum.js";
import validator from "validator";

const phoneRegex = /^09[0-9]{9}$/;
const telephoneRegex = /^0\d{2,3}\d{8}$/;
const latitudeRegex = /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/;
const longitudeRegex = /^-?((1?[0-7]?|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/;
const postcodeRegex = /^\d{10}$/;
const nationalCodeRegex = /^\d{3}\d{6}\d{1}$/;

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
    bankNumber: Joi.string().required().min(16).max(16),                        //todo:add validation
    nationalCode: Joi.string().required().pattern(new RegExp(nationalCodeRegex)).message("invalid national code"),
    password: Joi.string().required().min(4),
});

type registerDtoType = {
    phoneNumber: string,
    otp: string,
    fullName: string,
    bankNumber: string,
    nationalCode: string,
    password: string,
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
    longitude: Joi.string().pattern(new RegExp(longitudeRegex)).message("invalid longitude"),
    latitude: Joi.string().pattern(new RegExp(latitudeRegex)).message("invalid latitude"),
    state: Joi.string().valid(...Object.values(statesEnum)).required(),
    city: Joi.string().required(),                                              //todo:add validation
    address: Joi.string().required(),
    number: Joi.number().min(0),
    postCode: Joi.string().pattern(new RegExp(postcodeRegex)).message("invalid post code").required(),
    publicMode: Joi.boolean()
}).custom((value, helpers) => {
    const { longitude, latitude } = value;
    if ((longitude && latitude) || (!longitude && !latitude)) {
        return value;
    } else {
        return helpers.error('enter both longitude and latitude or neither of them');
    }
}, 'properties consistency');

type registerAddressDtoType = {
    longitude?: string,
    latitude?: string,
    state: statesEnum,
    city: string,
    address: string,
    number?: number,
    postCode: string,
    publicMode?: boolean
}

export { registerAddressDto, registerAddressDtoType }

//*getUserAddresses
const getUserAddressesDto = Joi.object({
    page: Joi.number().min(1)
});

type getUserAddressesDtoType = {
    page: string
}

export { getUserAddressesDto, getUserAddressesDtoType }

//*registerStore
const registerStoreDto = Joi.object({
    name: Joi.string().min(2).required(),
    about: Joi.string(),
    phoneNumber: Joi.string().pattern(new RegExp(telephoneRegex)).message("invalid telephone number"),
    website: Joi.string().uri()
});

type registerStoreDtoType = {
    name: string,
    about?: string,
    phoneNumber?: string,
    website?: string
}

export { registerStoreDto, registerStoreDtoType }

//*preRegisterNotifPhone
const preRegisterNotifPhoneDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
});

type preRegisterNotifPhoneDtoType = {
    phoneNumber: string
}

export { preRegisterNotifPhoneDto, preRegisterNotifPhoneDtoType }

//*registerNotifPhone
const registerNotifPhoneDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    otp: Joi.string().required().min(6).max(6)
});

type registerNotifPhoneDtoType = {
    phoneNumber: string,
    otp: string
}

export { registerNotifPhoneDto, registerNotifPhoneDtoType }

//*registerStoreLogo
const registerStoreLogoDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    logo: Joi.array().max(1).items(Joi.object({
        originalFilename: Joi.string().required(),
        mimetype: Joi.string().required(),
        size: Joi.number().max(1000 * 1000 * (Number(process.env.MAX_DOC_SIZE) || 20)).required(),
        filepath: Joi.string().required(),
    }).unknown(true)).required()
});

type registerStoreLogoDtoType = {
    phoneNumber: string,
    logo: string[]
}

export { registerStoreLogoDto, registerStoreLogoDtoType }