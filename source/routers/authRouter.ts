import express from "express";
import authController from "../controllers/authController.js";
import { genericValidator, FieldType } from "../utils/requestChecker.js";
import { getUserAddressesDto, loginDto, preRegisterDto, preRegisterEmailDto, registerAddressDto, registerDto, registerEmailDto, preRegisterNotifPhoneDto, registerStoreDto, registerNotifPhoneDto, registerStoreLogoDto, deleteAddressDto, editProfileDto } from "../dtos/auth.dto.js";
import userJwt from "../middlewares/userJwt.js";

const authRouter = express.Router();

authRouter.post("/pre-register", genericValidator(preRegisterDto), authController.preRegister);

authRouter.post("/register", genericValidator(registerDto), authController.register);

authRouter.get("/login", genericValidator(loginDto, FieldType.QUERY), authController.login);

authRouter.put("/profile/pre-register-email", userJwt, genericValidator(preRegisterEmailDto), authController.preRegisterEmail);

authRouter.put("/profile/register-email", userJwt, genericValidator(registerEmailDto), authController.registerEmail);

authRouter.post("/profile/address", userJwt, genericValidator(registerAddressDto), authController.registerAddress);

authRouter.delete("/profile/address", userJwt, genericValidator(deleteAddressDto, FieldType.QUERY), authController.deleteAddress);

authRouter.get("/profile/address", userJwt, genericValidator(getUserAddressesDto, FieldType.QUERY), authController.getUserAddresses);

authRouter.post("/profile/notifphone/otp", userJwt, genericValidator(preRegisterNotifPhoneDto), authController.preRegisterNotifPhone);

authRouter.put("/profile/notifphone", userJwt, genericValidator(registerNotifPhoneDto), authController.registerNotifPhone);

authRouter.get("/profile", userJwt, authController.getUserInfo);

authRouter.put("/profile", userJwt, genericValidator(editProfileDto), authController.editProfile);

authRouter.post("/store", userJwt, genericValidator(registerStoreDto), authController.registerStore);

authRouter.put("/store/logo", userJwt, genericValidator(registerStoreLogoDto, FieldType.FORM), authController.registerStoreLogo);

authRouter.get("/store", userJwt, authController.getStoreInfo);

export default authRouter;