import express from "express";
import authController from "../controllers/authController.js";
import { genericValidator } from "../utils/requestChecker.js";
import { preRegisterDto, registerDto } from "../dtos/auth.dto.js";
const authRouter = express.Router();
authRouter.post("/pre-register", genericValidator(preRegisterDto), authController.preRegister);
authRouter.post("/register", genericValidator(registerDto), authController.register);
export default authRouter;
