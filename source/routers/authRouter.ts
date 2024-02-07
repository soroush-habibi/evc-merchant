import express from "express";
import authController from "../controllers/authController.js";
import { genericValidator, FieldType } from "../utils/requestChecker.js";
import { loginDto, preRegisterDto, preRegisterEmailDto, registerAddressDto, registerDto, registerEmailDto } from "../dtos/auth.dto.js";
import userJwt from "../middlewares/userJwt.js";

const authRouter = express.Router();

authRouter.post("/pre-register", genericValidator(preRegisterDto), authController.preRegister);

authRouter.post("/register", genericValidator(registerDto), authController.register);

authRouter.get("/login", genericValidator(loginDto, FieldType.QUERY), authController.login);

authRouter.put("/profile/pre-register-email", userJwt, genericValidator(preRegisterEmailDto), authController.preRegisterEmail);

authRouter.put("/profile/register-email", userJwt, genericValidator(registerEmailDto), authController.registerEmail);

authRouter.put("/profile/register-address", userJwt, genericValidator(registerAddressDto), authController.registerAddress);

export default authRouter;