import express from "express";
import authController from "../controllers/authController.js";
import { genericValidator } from "../utils/requestChecker.js";
import { loginDto, preRegisterDto, registerDto } from "../dtos/auth.dto.js";
const authRouter = express.Router();
authRouter.post("/pre-register", genericValidator(preRegisterDto), authController.preRegister);
authRouter.post("/register", genericValidator(registerDto), authController.register);
authRouter.get("/login", genericValidator(loginDto), authController.login);
export default authRouter;
