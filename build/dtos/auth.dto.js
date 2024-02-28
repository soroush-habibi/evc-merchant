import Joi from "joi";
import { statesEnum } from "../enum/states.enum.js";
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
export { preRegisterDto };
//*register
const registerDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    otp: Joi.string().required().min(6).max(6),
    password: Joi.string().required().min(4),
});
export { registerDto };
//*editProfile
const editProfileDto = Joi.object({
    fullName: Joi.string().min(2),
    bankNumber: Joi.string().min(16).max(16), //todo:add validation
    nationalCode: Joi.string().pattern(new RegExp(nationalCodeRegex)).message("invalid national code"),
});
export { editProfileDto };
//*login
const loginDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    otp: Joi.string().min(6).max(6),
    password: Joi.string().min(4),
}).xor("otp", "password");
export { loginDto };
//*changePassword
const changePasswordDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    otp: Joi.string().min(6).max(6).required(),
    password: Joi.string().min(4).required(),
});
export { changePasswordDto };
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
//*registerAddress
const registerAddressDto = Joi.object({
    longitude: Joi.string().pattern(new RegExp(longitudeRegex)).message("invalid longitude"),
    latitude: Joi.string().pattern(new RegExp(latitudeRegex)).message("invalid latitude"),
    state: Joi.string().valid(...Object.values(statesEnum)).required(),
    city: Joi.string().required(), //todo:add validation
    address: Joi.string().required(),
    number: Joi.number().min(0),
    postCode: Joi.string().pattern(new RegExp(postcodeRegex)).message("invalid post code").required(),
    publicMode: Joi.boolean()
}).custom((value, helpers) => {
    const { longitude, latitude } = value;
    if ((longitude && latitude) || (!longitude && !latitude)) {
        return value;
    }
    else {
        return helpers.error('enter both longitude and latitude or neither of them');
    }
}, 'properties consistency');
export { registerAddressDto };
//*deleteAddress
const deleteAddressDto = Joi.object({
    postCode: Joi.string().pattern(new RegExp(postcodeRegex)).message("invalid post code").required()
});
export { deleteAddressDto };
//*getUserAddresses
const getUserAddressesDto = Joi.object({
    page: Joi.number().min(1),
    postCode: Joi.string().pattern(new RegExp(postcodeRegex)).message("invalid post code"),
});
export { getUserAddressesDto };
//*registerStore
const registerStoreDto = Joi.object({
    name: Joi.string().min(2).required(),
    about: Joi.string(),
    phoneNumber: Joi.string().pattern(new RegExp(telephoneRegex)).message("invalid telephone number"),
    website: Joi.string().uri()
});
export { registerStoreDto };
//*preRegisterNotifPhone
const preRegisterNotifPhoneDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
});
export { preRegisterNotifPhoneDto };
//*registerNotifPhone
const registerNotifPhoneDto = Joi.object({
    phoneNumber: Joi.string().pattern(new RegExp(phoneRegex)).message('invalid phone number').required(),
    otp: Joi.string().required().min(6).max(6)
});
export { registerNotifPhoneDto };
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
export { registerStoreLogoDto };
